export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
  addedAt: Date;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface VoiceCommand {
  action: 'add' | 'remove' | 'find' | 'clear' | 'complete';
  item?: string;
  quantity?: number;
  modifiers?: string[];
}

export interface Suggestion {
  id: string;
  name: string;
  category: string;
  reason: string;
  type: 'history' | 'seasonal' | 'substitute' | 'trending';
}

export interface VoiceState {
  isListening: boolean;
  isProcessing: boolean;
  transcript: string;
  confidence: number;
  error: string | null;
}