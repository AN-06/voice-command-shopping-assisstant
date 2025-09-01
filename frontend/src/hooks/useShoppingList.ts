import { useState, useCallback, useEffect } from "react";
import { ShoppingItem, VoiceCommand, Suggestion } from "../types";
import { categorizeItem } from "../utils/itemCategories";

// 🔗 Backend API base URL
const API_BASE = "https://voice-shopping-backend-nsxu.onrender.com/api";

export function useShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  // ✅ Suggestion generator
  const generateSuggestions = useCallback(() => {
    const newSuggestions: Suggestion[] = [];

    const frequentItems = ["milk", "bread", "eggs", "bananas"];
    frequentItems.forEach((item) => {
      if (!items.some((listItem) => listItem.name.toLowerCase() === item)) {
        newSuggestions.push({
          id: crypto.randomUUID(),
          name: item,
          category: categorizeItem(item),
          reason: "Frequently bought",
          type: "history",
        });
      }
    });

    const seasonalItems = ["fresh strawberries", "grilling supplies", "sunscreen"];
    seasonalItems.forEach((item) => {
      newSuggestions.push({
        id: crypto.randomUUID(),
        name: item,
        category: categorizeItem(item),
        reason: "Seasonal favorite",
        type: "seasonal",
      });
    });

    if (items.some((i) => i.name.toLowerCase().includes("milk"))) {
      newSuggestions.push({
        id: crypto.randomUUID(),
        name: "almond milk",
        category: "dairy",
        reason: "Healthy alternative",
        type: "substitute",
      });
    }

    setSuggestions(newSuggestions.slice(0, 6));
  }, [items]);

  // ✅ Load list from backend
  useEffect(() => {
    const fetchList = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${API_BASE}/list`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();

          // 👇 fix: support both _id (Mongo) and id
          const mapped: ShoppingItem[] = data.items.map((item: ShoppingItem & { _id?: string }) => ({
            ...item,
            id: item._id ?? item.id ?? crypto.randomUUID(),
            addedAt: new Date(item.addedAt),
          }));

          setItems(mapped);
        }
      } catch (error) {
        console.error("Error loading shopping list:", error);
      }
    };

    fetchList();
  }, []);

  // ✅ Save list to backend
  useEffect(() => {
    if (items.length === 0) return;

    const saveList = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        await fetch(`${API_BASE}/list`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ items }),
        });
      } catch (error) {
        console.error("Error saving shopping list:", error);
      }
    };

    saveList();
    generateSuggestions();
  }, [items, generateSuggestions]);

  // ✅ Add item
  const addItem = useCallback(
    (name: string, quantity: number = 1) => {
      const existingItem = items.find(
        (item) => item.name.toLowerCase() === name.toLowerCase()
      );

      if (existingItem) {
        setItems((prev) =>
          prev.map((item) =>
            item.id === existingItem.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        );
      } else {
        const newItem: ShoppingItem = {
          id: crypto.randomUUID(),
          name: name.trim(),
          quantity,
          category: categorizeItem(name),
          addedAt: new Date(),
          completed: false,
          priority: "medium",
        };
        setItems((prev) => [...prev, newItem]);
      }
    },
    [items]
  );

  // ✅ Remove / toggle / clear
  const removeItem = useCallback(
    (name: string) => setItems((prev) => prev.filter((i) => i.name.toLowerCase() !== name.toLowerCase())),
    []
  );

  const toggleComplete = useCallback(
    (id: string) => setItems((prev) => prev.map((i) => (i.id === id ? { ...i, completed: !i.completed } : i))),
    []
  );

  const clearCompleted = useCallback(() => setItems((prev) => prev.filter((i) => !i.completed)), []);
  const clearAll = useCallback(() => setItems([]), []);

  // ✅ Voice command processor
  const processVoiceCommand = useCallback(
    (command: VoiceCommand) => {
      switch (command.action) {
        case "add":
          if (command.item) {
            addItem(command.item, command.quantity || 1);
            return `Added ${command.quantity || 1} ${command.item}`;
          }
          break;
        case "remove":
          if (command.item) {
            removeItem(command.item);
            return `Removed ${command.item}`;
          }
          break;
        case "clear":
          clearAll();
          return "List cleared";
        case "find":
          return `Searching for ${command.item}...`;
        default:
          return "Command not recognized";
      }
      return "Please specify an item";
    },
    [addItem, removeItem, clearAll]
  );

  // ✅ Group by category
  const getItemsByCategory = useCallback(() => {
    const grouped = items.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, ShoppingItem[]>);

    const order = ["produce", "dairy", "meat", "bakery", "pantry", "beverages", "snacks", "household", "health", "frozen"];

    return order.reduce((acc, c) => {
      if (grouped[c]) acc[c] = grouped[c].sort((a, b) => a.name.localeCompare(b.name));
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
    completedItems: items.filter((i) => i.completed).length,
  };
}
