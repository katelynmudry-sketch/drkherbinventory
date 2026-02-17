import { useState, useEffect } from 'react';
import { Mic, MicOff, Plus, Volume2, Check, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { useAddHerb, useAddInventory, useHerbs, useRemoveInventoryByHerbName, useUpdateInventoryByHerbName, InventoryLocation, InventoryStatus } from '@/hooks/useInventory';
import { checkHerbAvailabilityByName, AvailabilityInfo, formatAvailabilityMessage } from '@/hooks/useInventoryCheck';
import { AvailabilityAlert } from '@/components/AvailabilityAlert';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { correctHerbName, getHerbSuggestions } from '@/lib/herbCorrection';
import { supabase } from '@/integrations/supabase/client';

type CommandType = 'add' | 'remove' | 'change';

interface ParsedCommand {
  type: CommandType;
  location: InventoryLocation | null;
  status: InventoryStatus | null;
  herbNames: string[];
}

export function VoiceHerbAdd() {
  const { transcript, isListening, isSupported, startListening, stopListening, resetTranscript } = useVoiceRecognition();
  const { data: existingHerbs } = useHerbs();
  const addHerb = useAddHerb();
  const addInventory = useAddInventory();
  const removeInventory = useRemoveInventoryByHerbName();
  const updateInventory = useUpdateInventoryByHerbName();
  
  const [lastTranscript, setLastTranscript] = useState('');
  const [parsedCommand, setParsedCommand] = useState<ParsedCommand | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [herbAvailability, setHerbAvailability] = useState<Record<string, AvailabilityInfo[]>>({});

  // Parse transcript when voice input stops
  useEffect(() => {
    if (transcript && transcript !== lastTranscript && !isListening) {
      setLastTranscript(transcript);
      const parsed = parseVoiceCommand(transcript);
      setParsedCommand(parsed);
      setHerbAvailability({});
    }
  }, [transcript, isListening, lastTranscript]);

  // Check availability when adding to clinic as low/out
  useEffect(() => {
    const checkAvailability = async () => {
      if (!parsedCommand) return;
      if (parsedCommand.type !== 'add') return;
      
      const location = parsedCommand.location || 'backstock';
      const status = parsedCommand.status || 'full';
      
      // Only check for clinic with low/out status
      if (location !== 'clinic' || status === 'full') {
        setHerbAvailability({});
        return;
      }
      
      const availability: Record<string, AvailabilityInfo[]> = {};
      
      for (const herbName of parsedCommand.herbNames) {
        try {
          const result = await checkHerbAvailabilityByName(herbName);
          if (result.availability.length > 0) {
            availability[herbName] = result.availability;
          }
        } catch (error) {
          console.error(`Error checking availability for ${herbName}:`, error);
        }
      }
      
      setHerbAvailability(availability);
      
      // Speak alert if any herbs found elsewhere
      if (Object.keys(availability).length > 0) {
        const herbsFound = Object.keys(availability);
        const message = `Note: ${herbsFound.join(', ')} ${herbsFound.length > 1 ? 'are' : 'is'} available in other locations`;
        speakResponse(message);
      }
    };
    
    checkAvailability();
  }, [parsedCommand]);

  const parseVoiceCommand = (command: string): ParsedCommand => {
    const text = command.toLowerCase();
    
    // Detect command type (add, remove, or change)
    let type: CommandType = 'add';
    if (text.includes('remove') || text.includes('delete') || text.includes('take out')) {
      type = 'remove';
    } else if (text.includes('change') || text.includes('set') || text.includes('mark') || text.includes('update')) {
      type = 'change';
    }
    
    // Detect explicit location keywords
    let explicitLocation: InventoryLocation | null = null;
    if (text.includes('backstock') || text.includes('back stock')) {
      explicitLocation = 'backstock';
    } else if (text.includes('tincture')) {
      explicitLocation = 'tincture';
    } else if (text.includes('clinic')) {
      explicitLocation = 'clinic';
    } else if (text.includes('bulk')) {
      explicitLocation = 'bulk';
    }
    
    // Detect status (relevant for add and change commands)
    let status: InventoryStatus | null = null;
    if (text.includes('full')) {
      status = 'full';
    } else if (text.includes('low')) {
      status = 'low';
    } else if (text.includes('out') || text.includes('empty')) {
      status = 'out';
    }
    
    // Determine location: if no explicit location, "low" and "out" default to clinic
    // For change commands with tincture, default to tincture location
    let location: InventoryLocation | null = explicitLocation;
    if (!explicitLocation && (status === 'low' || status === 'out')) {
      location = 'clinic';
    }
    
    // Extract herb names - remove command words and split by commas or "and"
    const cleanedText = text
      .replace(/add to|add|remove from|remove|delete from|delete|take out of|take out|put in|put|change|set|mark|update|to|from|as|backstock|back stock|tincture|clinic|bulk|full|low|out|empty|stock|status/gi, '')
      .trim();
    
    // Split by comma, "and", or multiple spaces
    const herbNames = cleanedText
      .split(/,|and|\s{2,}/)
      .map(name => name.trim())
      .filter(name => name.length > 1)
      .map(name => correctHerbName(name)) // Apply smart correction
      .filter((name): name is string => name !== null); // Drop anything that didn't match a known herb
    
    return { type, location, status, herbNames };
  };

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      setParsedCommand(null);
      startListening();
    }
  };

  // Pre-validate herbs exist for remove/change commands
  const validateHerbsExist = async (herbNames: string[], location: InventoryLocation): Promise<{ found: string[]; notFound: string[] }> => {
    const found: string[] = [];
    const notFound: string[] = [];
    
    for (const herbName of herbNames) {
      const { data: inventoryItems } = await supabase
        .from('inventory')
        .select('id, herbs!inner(name)')
        .eq('location', location)
        .ilike('herbs.name', herbName);
      
      if (inventoryItems && inventoryItems.length > 0) {
        found.push(herbName);
      } else {
        notFound.push(herbName);
      }
    }
    
    return { found, notFound };
  };

  const handleConfirm = async () => {
    if (!parsedCommand || parsedCommand.herbNames.length === 0) {
      toast.error('No herbs detected in your command');
      return;
    }

    const location = parsedCommand.location || 'backstock';
    const status = parsedCommand.status || 'full';
    
    setIsProcessing(true);
    let successCount = 0;
    let errorCount = 0;

    if (parsedCommand.type === 'remove' || parsedCommand.type === 'change') {
      // Pre-validate that all herbs exist in the specified location
      const { found, notFound } = await validateHerbsExist(parsedCommand.herbNames, location);
      
      if (notFound.length > 0) {
        setIsProcessing(false);
        const notFoundMsg = notFound.length === 1 
          ? `"${notFound[0]}" is not in ${location}.` 
          : `These herbs are not in ${location}: ${notFound.join(', ')}.`;
        const clarifyMsg = `${notFoundMsg} Please check the spelling or location.`;
        toast.error(clarifyMsg);
        speakResponse(clarifyMsg);
        
        // Keep only the herbs that weren't found so user can correct them
        if (found.length > 0) {
          // Some herbs were found, proceed with those and keep notFound for editing
          setParsedCommand({ ...parsedCommand, herbNames: notFound });
        }
        return;
      }
      
      if (parsedCommand.type === 'remove') {
        // Handle remove command
        for (const herbName of parsedCommand.herbNames) {
          try {
            await removeInventory.mutateAsync({ herbName, location });
            successCount++;
          } catch (error: any) {
            console.error(`Failed to remove ${herbName}:`, error);
            toast.error(error.message || `Failed to remove ${herbName}`);
            errorCount++;
          }
        }

        setIsProcessing(false);
        
        if (successCount > 0) {
          const message = `Removed ${successCount} herb${successCount > 1 ? 's' : ''} from ${location}`;
          toast.success(message);
          speakResponse(message);
        }
      } else {
        // Handle change/update status command
        for (const herbName of parsedCommand.herbNames) {
          try {
            await updateInventory.mutateAsync({ herbName, location, status });
            successCount++;
          } catch (error: any) {
            console.error(`Failed to update ${herbName}:`, error);
            toast.error(error.message || `Failed to update ${herbName}`);
            errorCount++;
          }
        }

        setIsProcessing(false);
        
        if (successCount > 0) {
          const message = `Changed ${successCount} herb${successCount > 1 ? 's' : ''} in ${location} to ${status}`;
          toast.success(message);
          speakResponse(message);
        }
      }
    } else {
      // Handle add command
      for (const herbName of parsedCommand.herbNames) {
        try {
          // Check if herb already exists
          let herb = existingHerbs?.find(
            h => h.name.toLowerCase() === herbName.toLowerCase()
          );
          
          // Create herb if it doesn't exist
          if (!herb) {
            herb = await addHerb.mutateAsync({ name: herbName });
          }
          
          // Add to inventory
          await addInventory.mutateAsync({
            herb_id: herb.id,
            location,
            status,
          });
          
          successCount++;
        } catch (error: any) {
          // Check if it's a duplicate entry error
          if (error?.code === '23505') {
            toast.error(`${herbName} already exists in ${location}`);
          } else {
            console.error(`Failed to add ${herbName}:`, error);
          }
          errorCount++;
        }
      }

      setIsProcessing(false);
      
      if (successCount > 0) {
        const message = `Added ${successCount} herb${successCount > 1 ? 's' : ''} to ${location} as ${status}`;
        toast.success(message);
        speakResponse(message);
      }
    }
    
    // Reset for next command
    setParsedCommand(null);
    resetTranscript();
    setLastTranscript('');
  };

  const handleCancel = () => {
    setParsedCommand(null);
    resetTranscript();
    setLastTranscript('');
    setEditingIndex(null);
    setHerbAvailability({});
  };

  const handleEditHerb = (index: number) => {
    if (parsedCommand) {
      setEditingIndex(index);
      setEditValue(parsedCommand.herbNames[index]);
    }
  };

  const handleSaveEdit = () => {
    if (parsedCommand && editingIndex !== null && editValue.trim()) {
      const newHerbNames = [...parsedCommand.herbNames];
      newHerbNames[editingIndex] = editValue.trim().charAt(0).toUpperCase() + editValue.trim().slice(1);
      setParsedCommand({ ...parsedCommand, herbNames: newHerbNames });
    }
    setEditingIndex(null);
    setEditValue('');
  };

  const handleRemoveHerb = (index: number) => {
    if (parsedCommand) {
      const newHerbNames = parsedCommand.herbNames.filter((_, i) => i !== index);
      if (newHerbNames.length === 0) {
        handleCancel();
      } else {
        setParsedCommand({ ...parsedCommand, herbNames: newHerbNames });
      }
    }
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
          {parsedCommand?.type === 'remove' ? (
            <Trash2 className="h-4 w-4" />
          ) : parsedCommand?.type === 'change' ? (
            <Volume2 className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Voice Commands
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
            disabled={isProcessing}
          >
            {isListening ? (
              <MicOff className="h-6 w-6" />
            ) : (
              <Mic className="h-6 w-6" />
            )}
          </Button>
          
          <p className="text-xs text-muted-foreground text-center max-w-xs">
            {isListening 
              ? "Listening... Say something like:" 
              : "Tap and say:"} 
            <span className="block italic mt-1">
              "Add to backstock low Yarrow, Nettle"
            </span>
            <span className="block italic">
              "Change tincture Damiana to out"
            </span>
          </p>
        </div>

        {transcript && (
          <div className="flex items-center gap-2 text-sm bg-secondary/50 rounded-lg p-3">
            <Volume2 className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="italic">"{transcript}"</span>
          </div>
        )}

        {parsedCommand && parsedCommand.herbNames.length > 0 && (
          <div className="space-y-3 border rounded-lg p-3 bg-background">
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium">
                {parsedCommand.type === 'remove' ? '🗑️ Removing:' : parsedCommand.type === 'change' ? '🔄 Changing:' : '➕ Adding:'}
              </div>
              <Badge variant={parsedCommand.type === 'remove' ? 'destructive' : parsedCommand.type === 'change' ? 'secondary' : 'default'}>
                {parsedCommand.type}
              </Badge>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">
                📍 {parsedCommand.location || 'backstock'}
              </Badge>
              {(parsedCommand.type === 'add' || parsedCommand.type === 'change') && (
                <Badge variant={
                  parsedCommand.status === 'full' ? 'default' :
                  parsedCommand.status === 'low' ? 'secondary' : 'destructive'
                }>
                  {parsedCommand.status || 'full'}
                </Badge>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {parsedCommand.herbNames.map((name, i) => (
                editingIndex === i ? (
                  <div key={i} className="flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                      <Input
                        value={editValue}
                        onChange={(e) => {
                          setEditValue(e.target.value);
                          setSuggestions(getHerbSuggestions(e.target.value));
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') { handleSaveEdit(); setSuggestions([]); }
                          if (e.key === 'Escape') { setEditingIndex(null); setSuggestions([]); }
                        }}
                        className="h-7 w-32 text-sm"
                        autoFocus
                      />
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { handleSaveEdit(); setSuggestions([]); }}>
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setEditingIndex(null); setSuggestions([]); }}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    {suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {suggestions.map((s) => (
                          <button
                            key={s}
                            className="text-xs px-2 py-0.5 rounded bg-secondary hover:bg-primary/20 transition-colors"
                            onClick={() => {
                              setEditValue(s);
                              setSuggestions([]);
                            }}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Badge 
                    key={i} 
                    variant="outline" 
                    className="bg-primary/10 cursor-pointer hover:bg-primary/20 transition-colors group pr-1"
                    onClick={() => handleEditHerb(i)}
                  >
                    🌿 {name}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveHerb(i);
                      }}
                      className="ml-1 opacity-50 group-hover:opacity-100 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )
              ))}
            </div>
            
            <p className="text-xs text-muted-foreground">Tap a herb to edit, ✕ to remove from list</p>
            
            {/* Availability alerts for clinic low/out */}
            {Object.keys(herbAvailability).length > 0 && (
              <div className="space-y-2">
                {Object.entries(herbAvailability).map(([herbName, availability]) => (
                  <AvailabilityAlert key={herbName} herbName={herbName} availability={availability} />
                ))}
              </div>
            )}
            
            <div className="flex gap-2 pt-2">
              <Button 
                size="sm" 
                onClick={handleConfirm}
                disabled={isProcessing}
                className="flex-1"
                variant={parsedCommand.type === 'remove' ? 'destructive' : parsedCommand.type === 'change' ? 'secondary' : 'default'}
              >
                {parsedCommand.type === 'remove' ? (
                  <Trash2 className="h-4 w-4 mr-1" />
                ) : (
                  <Check className="h-4 w-4 mr-1" />
                )}
                {isProcessing 
                  ? (parsedCommand.type === 'remove' ? 'Removing...' : parsedCommand.type === 'change' ? 'Updating...' : 'Adding...') 
                  : (parsedCommand.type === 'remove' ? 'Confirm Remove' : parsedCommand.type === 'change' ? 'Confirm Change' : 'Confirm Add')}
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleCancel}
                disabled={isProcessing}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
