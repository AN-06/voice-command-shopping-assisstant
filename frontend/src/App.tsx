import { useState, useEffect } from 'react';
import { ShoppingCart, Settings, Globe, LogOut } from 'lucide-react';

import { VoiceRecognition } from './components/VoiceRecognition';
import { ShoppingList } from './components/ShoppingList';
import { SmartSuggestions } from './components/SmartSuggestions';
import { VoiceSearch } from './components/VoiceSearch';
import { CommandFeedback } from './components/CommandFeedback';
import { QuickActions } from './components/QuickActions';

import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useShoppingList } from './hooks/useShoppingList';
import { processVoiceCommand } from './utils/nlpProcessor';

function App() {
  const { voiceState, startListening, stopListening, resetTranscript, isSupported } = useSpeechRecognition();

  const { 
    suggestions, 
    addItem, 
    removeItem, 
    toggleComplete, 
    clearCompleted, 
    clearAll,
    processVoiceCommand: executeCommand,
    getItemsByCategory,
    totalItems,
    completedItems
  } = useShoppingList();

  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'info'>('info');
  const [currentLanguage, setCurrentLanguage] = useState('en-US');
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  // Redirect if no token → go to signup first
  useEffect(() => {
    if (!token) {
      window.location.href = "/signup";   // 🔹 default first page is signup
    }
  }, [token]);

  // Process completed voice commands
  useEffect(() => {
    if (voiceState.transcript && voiceState.isProcessing && voiceState.confidence > 0.7) {
      const command = processVoiceCommand(voiceState.transcript);
      if (command) {
        try {
          const result = executeCommand(command);
          setFeedbackMessage(result);
          setFeedbackType('success');
        } catch {
          setFeedbackMessage('Sorry, I couldn\'t process that command');
          setFeedbackType('error');
        }
      } else {
        setFeedbackMessage('I didn\'t understand that command. Try "Add milk" or "Remove bread"');
        setFeedbackType('info');
      }
      resetTranscript();
    }
  }, [voiceState.transcript, voiceState.isProcessing, voiceState.confidence, executeCommand, resetTranscript]);

  const languages = [
    { code: 'en-US', name: 'English', flag: '🇺🇸' },
    { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
    { code: 'fr-FR', name: 'Français', flag: '🇫🇷' },
    { code: 'de-DE', name: 'Deutsch', flag: '🇩🇪' }
  ];

  const itemsByCategory = getItemsByCategory();

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    window.location.href = "/login";  // after logout go to login
  };

  // If no token, show loading/redirect
  if (!token) {
    return <p className="text-center p-6">Redirecting to signup...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Voice Shopping</h1>
                <p className="text-sm text-gray-600">Smart voice assistant</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={currentLanguage}
                onChange={(e) => setCurrentLanguage(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>

              {/* Settings button */}
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Settings className="w-5 h-5" />
              </button>

              {/* Logout button */}
              <button 
                onClick={handleLogout}
                className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-100"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Voice Recognition Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-sm border border-white/50">
          <VoiceRecognition
            voiceState={voiceState}
            onStartListening={startListening}
            onStopListening={stopListening}
            isSupported={isSupported}
          />
        </div>

        {/* Smart Suggestions */}
        {suggestions.length > 0 && (
          <SmartSuggestions 
            suggestions={suggestions}
            onAddItem={addItem}
          />
        )}

        {/* Voice Search */}
        <VoiceSearch onAddItem={addItem} />

        {/* Quick Actions */}
        <QuickActions
          onClearCompleted={clearCompleted}
          onClearAll={clearAll}
          hasCompletedItems={completedItems > 0}
          hasItems={totalItems > 0}
        />

        {/* Shopping List */}
        <ShoppingList
          itemsByCategory={itemsByCategory}
          onToggleComplete={toggleComplete}
          onRemoveItem={removeItem}
          totalItems={totalItems}
          completedItems={completedItems}
        />

        {/* Voice Commands Help */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-100">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-500" />
            Voice Commands Guide
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Adding Items:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• "Add milk to my list"</li>
                <li>• "I need 5 apples"</li>
                <li>• "Get organic bananas"</li>
                <li>• "Buy 2 bottles of water"</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Managing List:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• "Remove bread from list"</li>
                <li>• "Find cheese under $10"</li>
                <li>• "Clear completed items"</li>
                <li>• "Delete everything"</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Command Feedback */}
      <CommandFeedback
        message={feedbackMessage}
        type={feedbackType}
        onDismiss={() => setFeedbackMessage(null)}
      />

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center">
          <p className="text-gray-600 text-sm">
            🎤 Voice-powered shopping assistant with smart suggestions
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Supports multiple languages • Works offline • Privacy-focused
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
