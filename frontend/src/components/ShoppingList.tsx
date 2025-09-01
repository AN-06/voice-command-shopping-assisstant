import { Check, X, ShoppingCart } from 'lucide-react';
import { ShoppingItem } from '../types';
import { CATEGORIES } from '../utils/itemCategories';

interface ShoppingListProps {
  itemsByCategory: Record<string, ShoppingItem[]>;
  onToggleComplete: (id: string) => void;
  onRemoveItem: (name: string) => void;
  totalItems: number;
  completedItems: number;
}

export function ShoppingList({ 
  itemsByCategory, 
  onToggleComplete, 
  onRemoveItem,
  totalItems,
  completedItems
}: ShoppingListProps) {
  if (totalItems === 0) {
    return (
      <div className="text-center p-12">
        <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 text-lg">Your shopping list is empty</p>
        <p className="text-gray-400 text-sm mt-2">Use voice commands to add items</p>
      </div>
    );
  }

  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-gray-700">Shopping Progress</h3>
          <span className="text-sm text-gray-500">
            {completedItems}/{totalItems} items
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Items by category */}
      {Object.entries(itemsByCategory).map(([categoryKey, items]) => {
        const category = CATEGORIES[categoryKey as keyof typeof CATEGORIES];
        if (!category || items.length === 0) return null;

        return (
          <div key={categoryKey} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className={`px-4 py-3 ${category.color} border-b`}>
              <div className="flex items-center gap-2">
                <span className="text-lg">{category.icon}</span>
                <h3 className="font-medium">{category.name}</h3>
                <span className="text-sm opacity-75">({items.length})</span>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {items.map((item) => (
                <div 
                  key={item.id}
                  className={`
                    p-4 flex items-center justify-between transition-all duration-300
                    ${item.completed ? 'bg-gray-50 opacity-60' : 'hover:bg-gray-50'}
                  `}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={() => onToggleComplete(item.id)}
                      className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center
                        transition-all duration-200 hover:scale-110
                        ${item.completed 
                          ? 'bg-green-500 border-green-500' 
                          : 'border-gray-300 hover:border-green-400'
                        }
                      `}
                    >
                      {item.completed && <Check className="w-4 h-4 text-white" />}
                    </button>
                    
                    <div className="flex-1">
                      <p className={`
                        font-medium transition-all duration-200
                        ${item.completed ? 'line-through text-gray-500' : 'text-gray-800'}
                      `}>
                        {item.name}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.name)}
                    className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {completedItems > 0 && (
        <div className="text-center">
          <p className="text-green-600 font-medium">
            🎉 {completedItems} item{completedItems !== 1 ? 's' : ''} completed!
          </p>
        </div>
      )}
    </div>
  );
}
