import React from 'react';
import { Trash2, CheckCheck, RotateCcw } from 'lucide-react';

interface QuickActionsProps {
  onClearCompleted: () => void;
  onClearAll: () => void;
  hasCompletedItems: boolean;
  hasItems: boolean;
}

export function QuickActions({ 
  onClearCompleted, 
  onClearAll, 
  hasCompletedItems, 
  hasItems 
}: QuickActionsProps) {
  if (!hasItems) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
        <RotateCcw className="w-4 h-4" />
        Quick Actions
      </h3>
      
      <div className="flex gap-3">
        {hasCompletedItems && (
          <button
            onClick={onClearCompleted}
            className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors duration-200 text-sm font-medium"
          >
            <CheckCheck className="w-4 h-4" />
            Clear Completed
          </button>
        )}
        
        <button
          onClick={onClearAll}
          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors duration-200 text-sm font-medium"
        >
          <Trash2 className="w-4 h-4" />
          Clear All
        </button>
      </div>
      
      <div className="mt-3 text-xs text-gray-500">
        💬 Voice commands: "Clear completed" or "Clear all"
      </div>
    </div>
  );
}