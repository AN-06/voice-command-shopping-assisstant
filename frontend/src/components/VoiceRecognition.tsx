import React from 'react';
import { Mic, MicOff, Volume2, Loader2 } from 'lucide-react';
import { VoiceState } from '../types';

interface VoiceRecognitionProps {
  voiceState: VoiceState;
  onStartListening: () => void;
  onStopListening: () => void;
  isSupported: boolean;
}

export function VoiceRecognition({ 
  voiceState, 
  onStartListening, 
  onStopListening, 
  isSupported 
}: VoiceRecognitionProps) {
  if (!isSupported) {
    return (
      <div className="text-center p-8">
        <MicOff className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">Speech recognition is not supported in this browser</p>
        <p className="text-sm text-gray-500 mt-2">Please use Chrome, Edge, or Safari</p>
      </div>
    );
  }

  return (
    <div className="text-center p-8">
      <div className="relative inline-block">
        {/* Animated rings when listening */}
        {voiceState.isListening && (
          <>
            <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-25"></div>
            <div className="absolute inset-0 rounded-full bg-blue-400 animate-pulse opacity-20"></div>
          </>
        )}
        
        {/* Main microphone button */}
        <button
          onClick={voiceState.isListening ? onStopListening : onStartListening}
          disabled={voiceState.isProcessing}
          className={`
            relative w-24 h-24 rounded-full flex items-center justify-center
            transition-all duration-300 transform hover:scale-110 active:scale-95
            ${voiceState.isListening 
              ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200' 
              : 'bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-200'
            }
            ${voiceState.isProcessing ? 'opacity-75 cursor-not-allowed' : ''}
          `}
        >
          {voiceState.isProcessing ? (
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          ) : voiceState.isListening ? (
            <Volume2 className="w-8 h-8 text-white animate-pulse" />
          ) : (
            <Mic className="w-8 h-8 text-white" />
          )}
        </button>
      </div>

      {/* Status text */}
      <div className="mt-6 space-y-2">
        {voiceState.isListening && (
          <p className="text-blue-600 font-medium animate-pulse">
            🎤 Listening...
          </p>
        )}
        
        {voiceState.isProcessing && (
          <p className="text-orange-600 font-medium">
            🤔 Processing command...
          </p>
        )}
        
        {!voiceState.isListening && !voiceState.isProcessing && (
          <p className="text-gray-600">
            Tap to start voice commands
          </p>
        )}

        {voiceState.error && (
          <p className="text-red-500 text-sm">
            {voiceState.error}
          </p>
        )}
      </div>

      {/* Live transcript */}
      {voiceState.transcript && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <p className="text-sm text-gray-500 mb-1">You said:</p>
          <p className="text-gray-800 font-medium">"{voiceState.transcript}"</p>
          {voiceState.confidence > 0 && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Confidence</span>
                <span>{Math.round(voiceState.confidence * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                <div 
                  className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${voiceState.confidence * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick commands guide */}
      <div className="mt-6 text-xs text-gray-500 space-y-1">
        <p>Try saying:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          <span className="px-2 py-1 bg-gray-100 rounded">"Add milk"</span>
          <span className="px-2 py-1 bg-gray-100 rounded">"Remove bread"</span>
          <span className="px-2 py-1 bg-gray-100 rounded">"Find apples"</span>
          <span className="px-2 py-1 bg-gray-100 rounded">"Get 5 bananas"</span>
        </div>
      </div>
    </div>
  );
}