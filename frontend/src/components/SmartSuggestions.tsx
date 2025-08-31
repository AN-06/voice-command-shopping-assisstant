import React from 'react';
import { Plus, Sparkles, TrendingUp, History, RefreshCw } from 'lucide-react';
import { Suggestion } from '../types';

interface SmartSuggestionsProps {
  suggestions: Suggestion[];
  onAddItem: (name: string) => void;
}

export function SmartSuggestions({ suggestions, onAddItem }: SmartSuggestionsProps) {
  if (suggestions.length === 0) return null;

  const getIcon = (type: Suggestion['type']) => {
    switch (type) {
      case 'history': return <History className="w-4 h-4" />;
      case 'seasonal': return <Sparkles className="w-4 h-4" />;
      case 'substitute': return <RefreshCw className="w-4 h-4" />;
      case 'trending': return <TrendingUp className="w-4 h-4" />;
      default: return <Plus className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: Suggestion['type']) => {
    switch (type) {
      case 'history': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'seasonal': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'substitute': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'trending': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-purple-500" />
        <h3 className="font-semibold text-gray-800">Smart Suggestions</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className={`
              border rounded-lg p-3 cursor-pointer transition-all duration-200
              hover:shadow-md hover:scale-[1.02] active:scale-[0.98]
              ${getTypeColor(suggestion.type)}
            `}
            onClick={() => onAddItem(suggestion.name)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getIcon(suggestion.type)}
                <span className="font-medium text-sm">{suggestion.name}</span>
              </div>
              <Plus className="w-4 h-4 opacity-60" />
            </div>
            <p className="text-xs opacity-75 mt-1">{suggestion.reason}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          💡 Tap suggestions to add them, or use voice commands
        </p>
      </div>
    </div>
  );
}