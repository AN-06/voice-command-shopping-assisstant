import { VoiceCommand } from '../types';
import { isGroceryItem } from './itemCategories';

const ACTION_KEYWORDS = {
  add: ['add', 'get', 'buy', 'need', 'want', 'pick up', 'grab', 'purchase', 'agregar', 'comprar', 'necesito'],
  remove: ['remove', 'delete', 'take off', 'cancel', 'eliminar', 'quitar', 'borrar'],
  find: ['find', 'search', 'look for', 'show me', 'buscar', 'encontrar'],
  clear: ['clear', 'empty', 'delete all', 'limpiar', 'vaciar'],
  complete: ['done', 'completed', 'finished', 'check off', 'completado', 'terminado']
};

const QUANTITY_PATTERNS = [
  /(\d+)\s+(.*)/,  
  /(one|two|three|four|five|six|seven|eight|nine|ten|dozen)\s+(.*)/i,  
  /(a|an)\s+(.*)/i,  
  /(some|few)\s+(.*)/i  
];

const NUMBER_WORDS: { [key: string]: number } = {
  'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
  'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
  'a': 1, 'an': 1, 'some': 1, 'few': 2, 'dozen': 12
};

export function processVoiceCommand(transcript: string): VoiceCommand | null {
  if (!transcript.trim()) return null;

  let normalizedText = transcript.toLowerCase().trim();

  // 🔹 Simple corrections
  const corrections: { [key: string]: string } = {
    "doesn't": "dozen",
    "bananna": "banana",
    "strawbery": "strawberry",
    "bred": "bread"
  };

  for (const wrong in corrections) {
    if (normalizedText.includes(wrong)) {
      normalizedText = normalizedText.replace(new RegExp(wrong, "gi"), corrections[wrong]);
    }
  }

  // 🔹 Determine action
  let action: VoiceCommand['action'] = 'add';
  for (const [actionType, keywords] of Object.entries(ACTION_KEYWORDS)) {
    if (keywords.some(keyword => normalizedText.includes(keyword))) {
      action = actionType as VoiceCommand['action'];
      break;
    }
  }

  // 🔹 Extract item & quantity
  let item = '';
  let quantity = 1;
  let modifiers: string[] = [];

  // Remove action words
  let cleanText = normalizedText;
  for (const keywords of Object.values(ACTION_KEYWORDS)) {
    for (const keyword of keywords) {
      cleanText = cleanText.replace(new RegExp(`\\b${keyword}\\b`, 'gi'), '').trim();
    }
  }

  // Remove filler words
  cleanText = cleanText.replace(/\b(to|my|the|list|from|please|can you|could you)\b/gi, '').trim();

  // Match quantity
  for (const pattern of QUANTITY_PATTERNS) {
    const match = cleanText.match(pattern);
    if (match) {
      const quantityStr = match[1].toLowerCase();
      quantity = NUMBER_WORDS[quantityStr] || parseInt(quantityStr) || 1;
      item = match[2].trim();
      break;
    }
  }

  if (!item) item = cleanText;

  // Modifiers
  const modifierWords = ['organic', 'fresh', 'frozen', 'canned', 'dried', 'low fat', 'whole', 'skim'];
  modifiers = modifierWords.filter(modifier =>
    normalizedText.includes(modifier) || item.includes(modifier)
  );

  // 🔹 Grocery validation
  if (!isGroceryItem(item)) {
    console.warn("❌ Rejected non-grocery item:", item);
    return null;
  }

  console.log("✅ Accepted grocery item:", item);

  return {
    action,
    item: item.trim(),
    quantity,
    modifiers
  };
}

export function generateSearchSuggestions(query: string): string[] {
  const suggestions = [
    'organic apples',
    'whole milk',
    'fresh salmon',
    'sourdough bread',
    'greek yogurt',
    'free range eggs',
    'extra virgin olive oil',
    'brown rice',
    'dark chocolate',
    'sparkling water',
    'pumpkin',
    'mangoes',
    'watermelon',
    'grapes'
  ];

  if (!query) return suggestions.slice(0, 5);

  const filtered = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(query.toLowerCase())
  );

  return filtered.length > 0 ? filtered : suggestions.slice(0, 3);
}
