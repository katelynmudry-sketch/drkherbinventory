import { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { useSearchInventory, InventoryItem } from '@/hooks/useInventory';
import { cn } from '@/lib/utils';
import { correctHerbName } from '@/lib/herbCorrection';

interface VoiceQueryProps {
  onResult?: (items: InventoryItem[]) => void;
}

export function VoiceQuery({ onResult }: VoiceQueryProps) {
  const { transcript, isListening, isSupported, startListening, stopListening, resetTranscript } = useVoiceRecognition();
  const searchInventory = useSearchInventory();
  const [lastQuery, setLastQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [foundItems, setFoundItems] = useState<InventoryItem[]>([]);

  // Process transcript when voice input stops
  useEffect(() => {
    if (transcript && transcript !== lastQuery && !isListening) {
      setLastQuery(transcript);
      processQuery(transcript);
    }
  }, [transcript, isListening]);

  const processQuery = async (query: string) => {
    // Parse query to extract multiple herb names
    const herbNames = parseMultipleHerbs(query);
    
    if (herbNames.length === 0) {
      setResponse("I didn't catch any herb names. Try asking something like 'Check backstock for Angelica and Skullcap'");
      return;
    }

    try {
      const allResults: InventoryItem[] = [];
      const responseTexts: string[] = [];
      const notFoundHerbs: string[] = [];

      // Search for each herb
      for (const rawName of herbNames) {
        const searchTerm = correctHerbName(rawName) ?? rawName;
        const results = await searchInventory.mutateAsync(searchTerm);
        
        if (results.length === 0) {
          notFoundHerbs.push(searchTerm);
        } else {
          allResults.push(...results);
          const herbName = results[0].herbs?.name || searchTerm;
          const locations = results.map(r => {
            const status = r.status === 'full' ? 'fully stocked' : r.status === 'low' ? 'running low' : 'out of stock';
            if (r.location === 'tincture' && r.tincture_ready_at) {
              const readyDate = new Date(r.tincture_ready_at);
              const isReady = readyDate <= new Date();
              return `${r.location}: ${isReady ? 'Ready!' : `Ready ${readyDate.toLocaleDateString()}`}`;
            }
            return `${r.location}: ${status}`;
          });
          responseTexts.push(`${herbName}: ${locations.join(', ')}`);
        }
      }

      setFoundItems(allResults);
      onResult?.(allResults);

      // Build response message
      let fullResponse = responseTexts.join('. ');
      if (notFoundHerbs.length > 0) {
        const notFoundMsg = `Not found: ${notFoundHerbs.join(', ')}`;
        fullResponse = fullResponse ? `${fullResponse}. ${notFoundMsg}` : notFoundMsg;
      }

      if (!fullResponse) {
        fullResponse = "I couldn't find any inventory entries for those herbs.";
      }

      setResponse(fullResponse);
      speakResponse(fullResponse);
    } catch (error) {
      setResponse("Sorry, I had trouble searching. Please try again.");
    }
  };

  // Parse multiple herb names from a query, handling "and", commas, etc.
  const parseMultipleHerbs = (query: string): string[] => {
    const lowerQuery = query.toLowerCase();
    
    // Remove common filler words
    const fillerWords = ['is', 'the', 'in', 'backstock', 'do', 'we', 'have', 'any', 'where', 'what', 'about', 'check', 'a', 'an', 'for', 'tincture', 'clinic', 'bulk'];
    let cleanedQuery = lowerQuery;
    
    // Split by "and" or commas to get potential herb segments
    const segments = cleanedQuery
      .split(/\s+and\s+|,\s*/)
      .map(segment => {
        // Clean each segment
        const words = segment.split(' ').filter(w => !fillerWords.includes(w) && w.length > 0);
        return words.join(' ').trim();
      })
      .filter(segment => segment.length > 0);
    
    return segments;
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      setResponse(null);
      setFoundItems([]);
      startListening();
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
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-4">
          <Button
            size="lg"
            variant={isListening ? "destructive" : "default"}
            className={cn(
              "h-20 w-20 rounded-full transition-all",
              isListening && "animate-pulse ring-4 ring-destructive/30"
            )}
            onClick={handleToggleListening}
          >
            {isListening ? (
              <MicOff className="h-8 w-8" />
            ) : (
              <Mic className="h-8 w-8" />
            )}
          </Button>
          
          <p className="text-sm text-muted-foreground">
            {isListening ? "Listening... Speak now" : "Tap to ask about your inventory"}
          </p>

          {transcript && (
            <div className="flex items-center gap-2 text-sm">
              <Search className="h-4 w-4 text-muted-foreground" />
              <span className="italic">"{transcript}"</span>
            </div>
          )}

          {response && (
            <div className="flex items-start gap-2 rounded-lg bg-secondary/50 p-4 text-sm">
              <Volume2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p>{response}</p>
            </div>
          )}

          {foundItems.length > 0 && (
            <div className="w-full space-y-2">
              {foundItems.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-center justify-between rounded-lg border p-3",
                    item.status === 'full' && "border-green-500/30 bg-green-500/10",
                    item.status === 'low' && "border-yellow-500/30 bg-yellow-500/10",
                    item.status === 'out' && "border-red-500/30 bg-red-500/10"
                  )}
                >
                  <div>
                    <p className="font-medium">{item.herbs?.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{item.location}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-1 text-xs font-medium",
        status === 'full' && "bg-green-500/20 text-green-700 dark:text-green-400",
        status === 'low' && "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
        status === 'out' && "bg-red-500/20 text-red-700 dark:text-red-400"
      )}
    >
      {status === 'full' ? 'Full' : status === 'low' ? 'Low' : 'Out'}
    </span>
  );
}
