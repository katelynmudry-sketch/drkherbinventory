import { useState, useEffect, useMemo } from 'react';
import { Mic, MicOff, Sparkles, Volume2, Check, X, Loader2, Plus, Trash2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import {
  useAddHerb,
  useAddInventory,
  useHerbs,
  useRemoveInventoryByHerbName,
  useUpdateInventoryByHerbName,
  InventoryLocation,
  InventoryStatus,
} from '@/hooks/useInventory';
import { useCreateTinctureBatch } from '@/hooks/useTinctureBatches';
import { useVoiceAssistant, VoiceAssistantAction } from '@/hooks/useVoiceAssistant';
import { buildExtraNamesFromHerbs, scanForHerbs } from '@/lib/herbCorrection';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface VoiceAssistantProps {
  activeTab?: string;
}

interface ValidatedAction extends VoiceAssistantAction {
  herbName: string; // corrected to canonical name via scanForHerbs
}

const ACTION_ICON: Record<VoiceAssistantAction['type'], typeof Plus> = {
  add: Plus,
  remove: Trash2,
  update_status: RefreshCw,
};

export function VoiceAssistant({ activeTab = 'tinctures' }: VoiceAssistantProps) {
  const { transcript, alternatives, isListening, isSupported, error: voiceError, startListening, stopListening, resetTranscript } = useVoiceRecognition();
  const { data: existingHerbs } = useHerbs();
  const addHerb = useAddHerb();
  const addInventory = useAddInventory();
  const createTinctureBatch = useCreateTinctureBatch();
  const removeInventory = useRemoveInventoryByHerbName();
  const updateInventory = useUpdateInventoryByHerbName();
  const assistant = useVoiceAssistant();

  const [lastTranscript, setLastTranscript] = useState('');
  const [spokenResponse, setSpokenResponse] = useState<string | null>(null);
  const [validatedActions, setValidatedActions] = useState<ValidatedAction[]>([]);
  const [unprocessed, setUnprocessed] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const extraNames = useMemo(
    () => buildExtraNamesFromHerbs(existingHerbs ?? []),
    [existingHerbs]
  );

  // Surface insecure-context / network failures from the shared voice hook
  useEffect(() => {
    if (voiceError) {
      toast.error(voiceError);
    }
  }, [voiceError]);

  useEffect(() => {
    if (transcript && transcript !== lastTranscript && !isListening) {
      setLastTranscript(transcript);
      setSpokenResponse(null);
      setValidatedActions([]);
      setUnprocessed([]);

      assistant.mutate(
        { transcript, alternatives, activeTab },
        {
          onSuccess: (result) => {
            speakResponse(result.spokenResponse);
            setSpokenResponse(result.spokenResponse);

            const validated: ValidatedAction[] = [];
            const failed: string[] = [];

            for (const action of result.actions ?? []) {
              const tokens = action.herbName
                .toLowerCase()
                .split(/\s+/)
                .map((t) => t.replace(/[^a-z']/g, ''))
                .filter(Boolean);
              const matches = scanForHerbs(tokens, extraNames);
              if (matches.length > 0) {
                validated.push({ ...action, herbName: matches[0] });
              } else {
                failed.push(action.herbName);
              }
            }

            setValidatedActions(validated);
            setUnprocessed(failed);
          },
          onError: () => {
            const message = "Sorry, I couldn't reach the assistant. Try again or use the manual voice buttons.";
            setSpokenResponse(message);
            speakResponse(message);
          },
        }
      );
    }
  }, [transcript, alternatives, isListening, lastTranscript, activeTab, extraNames]);

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      setSpokenResponse(null);
      setValidatedActions([]);
      setUnprocessed([]);
      startListening();
    }
  };

  const handleConfirm = async () => {
    setIsProcessing(true);
    let successCount = 0;

    for (const action of validatedActions) {
      try {
        if (action.type === 'add') {
          const status = action.status ?? 'full';
          let herb = existingHerbs?.find(
            (h) => h.name.toLowerCase() === action.herbName.toLowerCase()
          );
          if (!herb) {
            herb = await addHerb.mutateAsync({ name: action.herbName });
          }
          await addInventory.mutateAsync({ herb_id: herb.id, location: action.location, status });

          if (action.location === 'tincture') {
            try {
              await createTinctureBatch.mutateAsync({ herb_id: herb.id });
            } catch (batchErr) {
              console.error(`Failed to create batch for ${action.herbName}:`, batchErr);
            }
          }
          successCount++;
        } else if (action.type === 'remove') {
          await removeInventory.mutateAsync({ herbName: action.herbName, location: action.location });
          successCount++;
        } else if (action.type === 'update_status') {
          const status = action.status ?? 'full';
          await updateInventory.mutateAsync({ herbName: action.herbName, location: action.location, status });
          successCount++;
        }
      } catch (error) {
        console.error(`Failed to process action for ${action.herbName}:`, error);
        const message = error instanceof Error ? error.message : `Failed to update ${action.herbName}`;
        toast.error(message);
      }
    }

    setIsProcessing(false);
    if (successCount > 0) {
      toast.success(`Updated ${successCount} item${successCount > 1 ? 's' : ''}`);
    }

    handleCancel();
  };

  const handleCancel = () => {
    setValidatedActions([]);
    setUnprocessed([]);
    setSpokenResponse(null);
    resetTranscript();
    setLastTranscript('');
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  if (!isSupported) {
    return (
      <Card className="bg-muted/50">
        <CardContent className="p-4 text-center text-muted-foreground">
          Voice recognition is not supported in this browser. Try Chrome, Edge, Safari, or DuckDuckGo (make sure microphone permissions are enabled).
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center gap-3">
          <Button
            size="lg"
            variant={isListening ? "destructive" : "secondary"}
            className={cn(
              "h-16 w-16 rounded-full transition-all",
              isListening && "animate-pulse ring-4 ring-destructive/30"
            )}
            onClick={handleToggleListening}
            disabled={isProcessing || assistant.isPending}
          >
            {isListening ? (
              <MicOff className="h-6 w-6" />
            ) : (
              <Mic className="h-6 w-6" />
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center max-w-xs">
            {isListening
              ? "Listening..."
              : "Tap and say anything, e.g.:"}
            <span className="block italic mt-1">"I just ran out of borage, what's in my inventory?"</span>
          </p>
        </div>

        {transcript && (
          <div className="flex items-center gap-2 text-sm bg-secondary/50 rounded-lg p-3">
            <Volume2 className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="italic">"{transcript}"</span>
          </div>
        )}

        {assistant.isPending && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Thinking...
          </div>
        )}

        {spokenResponse && !assistant.isPending && (
          <div className="flex items-start gap-2 rounded-lg bg-secondary/50 p-3 text-sm">
            <Volume2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p>{spokenResponse}</p>
          </div>
        )}

        {validatedActions.length > 0 && (
          <div className="space-y-3 border rounded-lg p-3 bg-background">
            <div className="text-sm font-medium">Proposed changes:</div>
            <div className="flex flex-wrap gap-2">
              {validatedActions.map((action, i) => {
                const Icon = ACTION_ICON[action.type];
                return (
                  <Badge key={i} variant="outline" className="bg-primary/10 gap-1">
                    <Icon className="h-3 w-3" />
                    {action.type === 'remove'
                      ? `Remove ${action.herbName} from ${action.location}`
                      : `${action.herbName} → ${action.location}${action.status ? ` (${action.status})` : ''}`}
                  </Badge>
                );
              })}
            </div>

            <div className="flex gap-2 pt-2">
              <Button size="sm" onClick={handleConfirm} disabled={isProcessing} className="flex-1">
                {isProcessing ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Check className="h-4 w-4 mr-1" />}
                {isProcessing ? 'Updating...' : 'Confirm'}
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel} disabled={isProcessing}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {unprocessed.length > 0 && (
          <p className="text-xs text-muted-foreground">
            Couldn't match: {unprocessed.join(', ')}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
