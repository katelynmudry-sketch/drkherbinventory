import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { InventoryLocation, InventoryStatus } from '@/hooks/useInventory';

export interface VoiceAssistantAction {
  type: 'add' | 'remove' | 'update_status';
  herbName: string;
  location: InventoryLocation;
  status?: InventoryStatus;
}

export interface VoiceAssistantResponse {
  actions: VoiceAssistantAction[];
  spokenResponse: string;
  needsClarification?: boolean;
}

export function useVoiceAssistant() {
  return useMutation({
    mutationFn: async ({ transcript, alternatives, activeTab }: {
      transcript: string;
      alternatives: string[];
      activeTab: string;
    }): Promise<VoiceAssistantResponse> => {
      const { data, error } = await supabase.functions.invoke('voice-assistant', {
        body: { transcript, alternatives, activeTab },
      });

      if (error) {
        // supabase-js surfaces non-2xx responses as errors but still passes
        // through the JSON body (with spokenResponse) via error.context.
        const context = (error as { context?: { json?: () => Promise<unknown> } }).context;
        if (context && typeof context.json === 'function') {
          const body = await context.json().catch(() => null);
          if (body?.spokenResponse) {
            return body as VoiceAssistantResponse;
          }
        }
        throw error;
      }

      return data as VoiceAssistantResponse;
    },
  });
}
