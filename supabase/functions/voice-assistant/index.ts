import { corsHeaders } from '../_shared/cors.ts';
import { getServiceClient, getUserClient } from '../_shared/supabaseClients.ts';
import { formatHerbNamesForPrompt, HerbNameRow } from '../_shared/herbNames.ts';

const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 1024;
const DEFAULT_DAILY_LIMIT = 50;

const LOCATIONS = ['backstock', 'tincture', 'clinic', 'bulk', 'bulk_backstock'];
const STATUSES = ['full', 'low', 'out', 'ordered'];

interface RequestBody {
  transcript: string;
  alternatives?: string[];
  activeTab?: string;
}

interface InventoryAction {
  type: 'add' | 'remove' | 'update_status';
  herbName: string;
  location: string;
  status?: string;
}

interface AssistantResult {
  actions: InventoryAction[];
  spokenResponse: string;
  needsClarification?: boolean;
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return jsonResponse({ error: 'Missing Authorization header' }, 401);
    }

    const { transcript, alternatives = [], activeTab = 'tinctures' } = await req.json() as RequestBody;
    if (!transcript || !transcript.trim()) {
      return jsonResponse({ error: 'Missing transcript' }, 400);
    }

    const userClient = getUserClient(authHeader);
    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) {
      return jsonResponse({ error: 'Unauthorized' }, 401);
    }

    const serviceClient = getServiceClient();

    // 1. Tier check — AI Assistant is a Pro-tier feature.
    const { data: subscription } = await serviceClient
      .from('subscriptions')
      .select('plan_tier, status')
      .eq('user_id', user.id)
      .maybeSingle();

    const isPro = subscription?.plan_tier === 'pro'
      && (subscription?.status === 'active' || subscription?.status === 'trialing');

    if (!isPro) {
      return jsonResponse({
        actions: [],
        spokenResponse: 'The AI Assistant is a Pro feature. Upgrade your plan to use it.',
      }, 403);
    }

    // 2. Rate limit — per-user daily cap on Claude calls.
    const dailyLimit = Number(Deno.env.get('VOICE_ASSISTANT_DAILY_LIMIT') ?? DEFAULT_DAILY_LIMIT);
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);

    const { count: usageCount } = await serviceClient
      .from('voice_api_usage')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', startOfDay.toISOString());

    if ((usageCount ?? 0) >= dailyLimit) {
      return jsonResponse({
        actions: [],
        spokenResponse: "You've reached today's AI Assistant limit. Try again tomorrow, or use the manual voice buttons.",
      }, 429);
    }

    // 3. Grounding data — this user's herbs + current inventory snapshot (RLS-scoped).
    const { data: herbs = [] } = await userClient
      .from('herbs')
      .select('id, name, common_name, latin_name, pinyin_name');

    const { data: inventory = [] } = await userClient
      .from('inventory')
      .select('location, status, herbs(name)');

    const herbNamesText = formatHerbNamesForPrompt((herbs ?? []) as HerbNameRow[]);

    const inventoryByLocation = new Map<string, Map<string, string[]>>();
    for (const item of (inventory ?? []) as Array<{ location: string; status: string; herbs: { name: string } | null }>) {
      const herbName = item.herbs?.name;
      if (!herbName) continue;
      if (!inventoryByLocation.has(item.location)) inventoryByLocation.set(item.location, new Map());
      const byStatus = inventoryByLocation.get(item.location)!;
      if (!byStatus.has(item.status)) byStatus.set(item.status, []);
      byStatus.get(item.status)!.push(herbName);
    }

    const inventorySummaryLines: string[] = [];
    for (const [location, byStatus] of inventoryByLocation) {
      const parts: string[] = [];
      for (const [status, names] of byStatus) {
        parts.push(`${status}: ${names.join(', ')}`);
      }
      inventorySummaryLines.push(`${location} — ${parts.join('; ')}`);
    }
    const inventorySummaryText = inventorySummaryLines.join('\n') || '(no inventory recorded yet)';

    // 4. System prompt.
    const systemPrompt = `You are a voice assistant for a herbal inventory management app used in a clinic.

The user spoke a voice command which may be a request to update inventory, a question about current inventory, or both at once.

Known herbs (canonical name, with alternate names in parentheses when available):
${herbNamesText || '(no herbs recorded yet)'}

Current inventory snapshot (location — status: herb names):
${inventorySummaryText}

Valid inventory locations: ${LOCATIONS.join(', ')}
Valid inventory statuses: ${STATUSES.join(', ')}

The user is currently viewing the "${activeTab}" tab. When a location isn't stated explicitly:
- If the active tab is "bulk", default location to "bulk".
- If the command implies the herb is low or out and no location is given, default to "clinic".

Respond ONLY by calling the inventory_response tool. For any inventory update mentioned in the command, add an entry to "actions" using the closest matching herb name from the known herbs list above (correct for speech-to-text mishearings). For any question about current inventory, answer it directly in "spokenResponse" using the snapshot above. If the command is too ambiguous to act on, set "needsClarification" to true, leave "actions" empty, and ask a clarifying question in "spokenResponse". Keep "spokenResponse" concise (1-2 sentences) since it will be read aloud.`;

    let userMessage = `Voice command: "${transcript}"`;
    if (alternatives.length > 1) {
      userMessage += `\n\nSpeech-to-text may have misheard part of this. Alternative interpretations: ${alternatives.slice(1).map((a) => `"${a}"`).join(', ')}`;
    }

    // 5. Call Claude with forced tool-use for structured output.
    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!anthropicKey) {
      throw new Error('ANTHROPIC_API_KEY is not configured');
    }

    const tool = {
      name: 'inventory_response',
      description: 'Structured result of interpreting a voice command for the herb inventory app.',
      input_schema: {
        type: 'object',
        required: ['actions', 'spokenResponse'],
        properties: {
          actions: {
            type: 'array',
            description: "Inventory mutations to perform. Empty if the command is query-only or unclear.",
            items: {
              type: 'object',
              required: ['type', 'herbName', 'location'],
              properties: {
                type: { type: 'string', enum: ['add', 'remove', 'update_status'] },
                herbName: { type: 'string', description: 'Best-guess canonical herb name from the known herbs list' },
                location: { type: 'string', enum: LOCATIONS },
                status: { type: 'string', enum: STATUSES, description: "Required for 'add' and 'update_status'; omit for 'remove'" },
              },
            },
          },
          spokenResponse: {
            type: 'string',
            description: 'Natural-language response to speak back to the user — confirms any actions taken AND answers any query portion of the command.',
          },
          needsClarification: {
            type: 'boolean',
            description: 'True if the command was too ambiguous to act on.',
          },
        },
      },
    };

    let result: AssistantResult;
    let inputTokens = 0;
    let outputTokens = 0;
    let success = true;
    let errorMessage: string | null = null;

    try {
      const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          system: systemPrompt,
          messages: [{ role: 'user', content: userMessage }],
          tools: [tool],
          tool_choice: { type: 'tool', name: 'inventory_response' },
        }),
      });

      if (!anthropicRes.ok) {
        const errText = await anthropicRes.text();
        throw new Error(`Anthropic API error ${anthropicRes.status}: ${errText}`);
      }

      const data = await anthropicRes.json();
      inputTokens = data.usage?.input_tokens ?? 0;
      outputTokens = data.usage?.output_tokens ?? 0;

      const toolUse = (data.content ?? []).find((block: { type: string; input?: unknown }) => block.type === 'tool_use');
      if (!toolUse) {
        throw new Error('Claude did not return a tool_use block');
      }
      result = toolUse.input as AssistantResult;
    } catch (error) {
      success = false;
      errorMessage = (error as Error).message;
      console.error('voice-assistant Claude call failed', error);
      result = {
        actions: [],
        spokenResponse: "Sorry, I'm having trouble right now. Try the manual voice buttons instead.",
      };
    }

    // 6. Log usage (service role, regardless of success).
    await serviceClient.from('voice_api_usage').insert({
      user_id: user.id,
      model: MODEL,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      transcript_len: transcript.length,
      action_count: result.actions?.length ?? 0,
      success,
      error_message: errorMessage,
    });

    return jsonResponse(result, success ? 200 : 502);
  } catch (error) {
    console.error('voice-assistant error', error);
    return jsonResponse({
      actions: [],
      spokenResponse: "Sorry, something went wrong. Try the manual voice buttons instead.",
      error: (error as Error).message,
    }, 500);
  }
});
