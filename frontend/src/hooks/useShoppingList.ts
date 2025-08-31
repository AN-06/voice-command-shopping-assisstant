import { useState, useCallback, useEffect } from 'react';
import { ShoppingItem, VoiceCommand, Suggestion } from '../types';
import { categorizeItem } from '../utils/itemCategories';

export function useShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('shopping-list');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setItems(parsed.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt)
        })));
      } catch (error) {
        console.error('Error loading shopping list:', error);
      }
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('shopping-list', JSON.stringify(items));
    generateSuggestions();
  }, [items]);

  const addItem = useCallback((name: string, quantity: number = 1) => {
    const existingItem = items.find(item => 
      item.name.toLowerCase() === name.toLowerCase()
    );

    if (existingItem) {
      setItems(prev => prev.map(item =>
        item.id === existingItem.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      const newItem: ShoppingItem = {
        id: crypto.randomUUID(),
        name: name.trim(),
        quantity,
        category: categorizeItem(name),
        addedAt: new Date(),
        completed: false,
        priority: 'medium'
      };
      setItems(prev => [...prev, newItem]);
    }
  }, [items]);

  const removeItem = useCallback((name: string) => {
    setItems(prev => prev.filter(item => 
      item.name.toLowerCase() !== name.toLowerCase()
    ));
  }, []);

  const toggleComplete = useCallback((id: string) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  }, []);

  const clearCompleted = useCallback(() => {
    setItems(prev => prev.filter(item => !item.completed));
  }, []);

  const clearAll = useCallback(() => {
    setItems([]);
  }, []);

  const processVoiceCommand = useCallback((command: VoiceCommand) => {
    switch (command.action) {
      case 'add':
        if (command.item) {
          addItem(command.item, command.quantity || 1);
          return `Added ${command.quantity || 1} ${command.item} to your list`;
        }
        break;
      case 'remove':
        if (command.item) {
          removeItem(command.item);
          return `Removed ${command.item} from your list`;
        }
        break;
      case 'clear':
        clearAll();
        return 'Cleared your shopping list';
      case 'find':
        return `Searching for ${command.item}...`;
      default:
        return 'Command not recognized';
    }
    return 'Please specify an item';
  }, [addItem, removeItem, clearAll]);

  const generateSuggestions = useCallback(() => {
    const newSuggestions: Suggestion[] = [];
    
    // History-based suggestions
    const frequentItems = ['milk', 'bread', 'eggs', 'bananas'];
    frequentItems.forEach(item => {
      if (!items.some(listItem => listItem.name.toLowerCase().includes(item))) {
        newSuggestions.push({
          id: crypto.randomUUID(),
          name: item,
          category: categorizeItem(item),
          reason: 'Frequently bought',
          type: 'history'
        });
      }
    });

    // Seasonal suggestions
    const seasonalItems = ['fresh strawberries', 'grilling supplies', 'sunscreen'];
    seasonalItems.forEach(item => {
      newSuggestions.push({
        id: crypto.randomUUID(),
        name: item,
        category: categorizeItem(item),
        reason: 'Seasonal favorite',
        type: 'seasonal'
      });
    });

    // Smart substitutes
    if (items.some(item => item.name.toLowerCase().includes('milk'))) {
      newSuggestions.push({
        id: crypto.randomUUID(),
        name: 'almond milk',
        category: 'dairy',
        reason: 'Healthy alternative',
        type: 'substitute'
      });
    }

    setSuggestions(newSuggestions.slice(0, 6));
  }, [items]);

  const getItemsByCategory = useCallback(() => {
    const grouped = items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, ShoppingItem[]>);

    // Sort categories by priority
    const priorityOrder = ['produce', 'dairy', 'meat', 'bakery', 'pantry', 'beverages', 'snacks', 'household', 'health', 'frozen'];
    
    return priorityOrder.reduce((acc, category) => {
      if (grouped[category]) {
        acc[category] = grouped[category].sort((a, b) => a.name.localeCompare(b.name));
      }
      return acc;
    }, {} as Record<string, ShoppingItem[]>);
  }, [items]);

  return {
    items,
    suggestions,
    addItem,
    removeItem,
    toggleComplete,
    clearCompleted,
    clearAll,
    processVoiceCommand,
    getItemsByCategory,
    totalItems: items.length,
    completedItems: items.filter(item => item.completed).length
  };
}