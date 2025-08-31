import React, { useState } from 'react';
import { Search, Filter, DollarSign } from 'lucide-react';
import { generateSearchSuggestions } from '../utils/nlpProcessor';

interface VoiceSearchProps {
  onAddItem: (name: string) => void;
}

export function VoiceSearch({ onAddItem }: VoiceSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const suggestions = generateSearchSuggestions(searchQuery);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <Search className="w-5 h-5 text-blue-500" />
        <h3 className="font-semibold text-gray-800">Search Items</h3>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="ml-auto p-1 text-gray-400 hover:text-gray-600"
        >
          <Filter className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for items... (or use voice)"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
          <Search className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
        </div>

        {showFilters && (
          <div className="p-4 bg-gray-50 rounded-lg space-y-3">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4" />
                Price Range
              </label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All prices</option>
                <option value="under-5">Under $5</option>
                <option value="5-15">$5 - $15</option>
                <option value="15-30">$15 - $30</option>
                <option value="over-30">Over $30</option>
              </select>
            </div>
          </div>
        )}

        {searchQuery && suggestions.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Suggestions:</p>
            <div className="grid grid-cols-1 gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onAddItem(suggestion);
                    setSearchQuery('');
                  }}
                  className="flex items-center justify-between p-3 text-left bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-all duration-200"
                >
                  <span className="text-gray-800">{suggestion}</span>
                  <Search className="w-4 h-4 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          🔍 Search by voice: "Find organic apples under $5"
        </p>
      </div>
    </div>
  );
}