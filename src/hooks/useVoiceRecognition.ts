import { useState, useCallback, useRef, useEffect } from 'react';

// Type declarations for Web Speech API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

interface VoiceRecognitionResult {
  transcript: string;
  alternatives: string[];
  isListening: boolean;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

export function useVoiceRecognition(): VoiceRecognitionResult {
  const [transcript, setTranscript] = useState('');
  const [alternatives, setAlternatives] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const isSupported = typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
        recognitionRef.current = null;
      }
    };
  }, []);

  const createRecognition = useCallback(() => {
    if (!isSupported) return null;

    if (recognitionRef.current) {
      recognitionRef.current.onresult = null;
      recognitionRef.current.onend = null;
      recognitionRef.current.onerror = null;
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }

    const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionConstructor();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 5;

    let bestInterim = '';
    let committedFinal = false;

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';
      const finalAlternatives: string[] = [];

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
          for (let a = 0; a < result.length; a++) {
            const alt = result[a].transcript.trim();
            if (alt && !finalAlternatives.includes(alt)) {
              finalAlternatives.push(alt);
            }
          }
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      if (interimTranscript.trim().length > bestInterim.length) {
        bestInterim = interimTranscript.trim();
      }

      if (finalTranscript.trim()) {
        committedFinal = true;
        bestInterim = '';
        setTranscript(finalTranscript.trim());
        setAlternatives(finalAlternatives);
      }
    };

    recognition.onend = () => {
      if (!committedFinal && bestInterim) {
        setTranscript(bestInterim);
        setAlternatives([bestInterim]);
      }
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        // handled by onend
        return;
      }
      // For network and other errors: commit interim if we have it
      if (!committedFinal && bestInterim) {
        committedFinal = true;
        setTranscript(bestInterim);
        setAlternatives([bestInterim]);
        bestInterim = '';
      }
      // Don't call setIsListening here — onend always fires after onerror
    };

    return recognition;
  }, [isSupported]);

  const startListening = useCallback(() => {
    if (!isSupported || isListening) return;

    const recognition = createRecognition();
    if (!recognition) return;

    recognitionRef.current = recognition;
    setTranscript('');
    setAlternatives([]);
    recognition.start();
    setIsListening(true);
  }, [isListening, isSupported, createRecognition]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setAlternatives([]);
  }, []);

  return {
    transcript,
    alternatives,
    isListening,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  };
}
