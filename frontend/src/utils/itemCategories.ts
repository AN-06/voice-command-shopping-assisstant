export const CATEGORIES = {
  'dairy': { name: 'Dairy', icon: '🥛', color: 'bg-blue-100 text-blue-800' },
  'produce': { name: 'Produce', icon: '🥬', color: 'bg-green-100 text-green-800' },
  'meat': { name: 'Meat', icon: '🥩', color: 'bg-red-100 text-red-800' },
  'pantry': { name: 'Pantry', icon: '🥫', color: 'bg-yellow-100 text-yellow-800' },
  'frozen': { name: 'Frozen', icon: '🧊', color: 'bg-cyan-100 text-cyan-800' },
  'snacks': { name: 'Snacks', icon: '🍿', color: 'bg-orange-100 text-orange-800' },
  'beverages': { name: 'Beverages', icon: '🥤', color: 'bg-purple-100 text-purple-800' },
  'household': { name: 'Household', icon: '🧽', color: 'bg-gray-100 text-gray-800' },
  'health': { name: 'Health', icon: '💊', color: 'bg-pink-100 text-pink-800' },
  'bakery': { name: 'Bakery', icon: '🍞', color: 'bg-amber-100 text-amber-800' }
} as const;

export const ITEM_DATABASE = {
  // Dairy
  'milk': { category: 'dairy', keywords: ['milk', 'leche', 'lait'] },
  'cheese': { category: 'dairy', keywords: ['cheese', 'queso', 'fromage'] },
  'yogurt': { category: 'dairy', keywords: ['yogurt', 'yoghurt'] },
  'butter': { category: 'dairy', keywords: ['butter', 'mantequilla'] },
  'eggs': { category: 'dairy', keywords: ['eggs', 'huevos', 'oeufs'] },

  // Produce
  'apples': { category: 'produce', keywords: ['apple', 'apples', 'manzana'] },
  'bananas': { category: 'produce', keywords: ['banana', 'bananas', 'plátano'] },
  'oranges': { category: 'produce', keywords: ['orange', 'oranges', 'naranja'] },
  'lettuce': { category: 'produce', keywords: ['lettuce', 'lechuga'] },
  'tomatoes': { category: 'produce', keywords: ['tomato', 'tomatoes', 'tomate'] },
  'onions': { category: 'produce', keywords: ['onion', 'onions', 'cebolla'] },
  'carrots': { category: 'produce', keywords: ['carrot', 'carrots', 'zanahoria'] },

  // Meat
  'chicken': { category: 'meat', keywords: ['chicken', 'pollo'] },
  'beef': { category: 'meat', keywords: ['beef', 'carne'] },
  'fish': { category: 'meat', keywords: ['fish', 'pescado'] },
  'salmon': { category: 'meat', keywords: ['salmon', 'salmón'] },

  // Pantry / Bakery
  'bread': { category: 'bakery', keywords: ['bread', 'pan'] },
  'rice': { category: 'pantry', keywords: ['rice', 'arroz'] },
  'pasta': { category: 'pantry', keywords: ['pasta', 'spaghetti'] },
  'flour': { category: 'pantry', keywords: ['flour', 'harina'] },
  'sugar': { category: 'pantry', keywords: ['sugar', 'azúcar'] },
  'salt': { category: 'pantry', keywords: ['salt', 'sal'] },
  'olive oil': { category: 'pantry', keywords: ['olive oil', 'aceite'] },

  // Beverages
  'water': { category: 'beverages', keywords: ['water', 'agua'] },
  'juice': { category: 'beverages', keywords: ['juice', 'jugo'] },
  'coffee': { category: 'beverages', keywords: ['coffee', 'café'] },
  'tea': { category: 'beverages', keywords: ['tea', 'té'] },

  // Snacks
  'chips': { category: 'snacks', keywords: ['chips', 'papas'] },
  'cookies': { category: 'snacks', keywords: ['cookies', 'galletas'] },
  'nuts': { category: 'snacks', keywords: ['nuts', 'nueces'] },

  // Household / Health
  'toothpaste': { category: 'health', keywords: ['toothpaste', 'pasta de dientes'] },
  'soap': { category: 'household', keywords: ['soap', 'jabón'] },
  'toilet paper': { category: 'household', keywords: ['toilet paper', 'papel higiénico'] },
  'detergent': { category: 'household', keywords: ['detergent', 'detergente'] }
};

// ✅ Seasonal extra items (not in main DB)
export const SEASONAL_ITEMS = [
  { name: "pumpkin", category: "produce" },
  { name: "mango", category: "produce" },
  { name: "mangoes", category: "produce" },
  { name: "berries", category: "produce" },
  { name: "strawberries", category: "produce" },
  { name: "watermelon", category: "produce" },
  { name: "grapes", category: "produce" },
  { name: "pineapple", category: "produce" }
];

// ✅ Smarter check if item is grocery (main DB + seasonal)
export function isGroceryItem(input: string): boolean {
  const lower = input.toLowerCase();

  // DB check
  for (const [item, data] of Object.entries(ITEM_DATABASE)) {
    if (lower === item) return true;
    if (lower.includes(item)) return true;
    if (data.keywords.some(k => lower.includes(k))) return true;
  }

  // Seasonal check
  if (SEASONAL_ITEMS.some(s => lower.includes(s.name))) {
    return true;
  }

  return false;
}

// ✅ Categorize item into category (DB first, then seasonal)
export function categorizeItem(itemName: string): string {
  const lowercaseName = itemName.toLowerCase();

  for (const [, data] of Object.entries(ITEM_DATABASE)) {
    if (data.keywords.some(keyword => lowercaseName.includes(keyword))) {
      return data.category;
    }
  }

  // Seasonal
  const seasonal = SEASONAL_ITEMS.find(s => lowercaseName.includes(s.name));
  if (seasonal) return seasonal.category;

  // Fallbacks
  if (lowercaseName.includes('milk') || lowercaseName.includes('cheese')) return 'dairy';
  if (lowercaseName.includes('apple') || lowercaseName.includes('fruit')) return 'produce';
  if (lowercaseName.includes('meat') || lowercaseName.includes('chicken')) return 'meat';
  if (lowercaseName.includes('bread') || lowercaseName.includes('cake')) return 'bakery';
  if (lowercaseName.includes('water') || lowercaseName.includes('drink')) return 'beverages';

  return 'pantry'; 
}
