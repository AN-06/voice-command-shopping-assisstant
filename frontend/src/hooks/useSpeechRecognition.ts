import { useState, useEffect, useCallback } from 'react';
import { VoiceState } from '../types';

export function useSpeechRecognition() {
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isListening: false,
    isProcessing: false,
    transcript: '',
    confidence: 0,
    error: null
  });

  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setVoiceState(prev => ({
        ...prev,
        error: 'Speech recognition not supported in this browser'
      }));
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();

    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = 'en-US';
    recognitionInstance.maxAlternatives = 1;

    recognitionInstance.onstart = () => {
      setVoiceState(prev => ({
        ...prev,
        isListening: true,
        error: null
      }));
    };

    recognitionInstance.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        const confidence = event.results[i][0].confidence;

        if (event.results[i].isFinal) {
          finalTranscript += transcript;
          setVoiceState(prev => ({
            ...prev,
            transcript: finalTranscript,
            confidence: confidence,
            isProcessing: true
          }));
        } else {
          interimTranscript += transcript;
          setVoiceState(prev => ({
            ...prev,
            transcript: interimTranscript,
            confidence: confidence
          }));
        }
      }
    };

    recognitionInstance.onerror = (event) => {
      setVoiceState(prev => ({
        ...prev,
        error: `Speech recognition error: ${event.error}`,
        isListening: false,
        isProcessing: false
      }));
    };

    recognitionInstance.onend = () => {
      setVoiceState(prev => ({
        ...prev,
        isListening: false,
        isProcessing: false
      }));
    };

    setRecognition(recognitionInstance);

    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (recognition && !voiceState.isListening) {
      setVoiceState(prev => ({
        ...prev,
        transcript: '',
        error: null
      }));
      recognition.start();
    }
  }, [recognition, voiceState.isListening]);

  const stopListening = useCallback(() => {
    if (recognition && voiceState.isListening) {
      recognition.stop();
    }
  }, [recognition, voiceState.isListening]);

  const resetTranscript = useCallback(() => {
    setVoiceState(prev => ({
      ...prev,
      transcript: '',
      isProcessing: false,
      confidence: 0
    }));
  }, []);

  return {
    voiceState,
    startListening,
    stopListening,
    resetTranscript,
    isSupported: !!recognition
  };
}