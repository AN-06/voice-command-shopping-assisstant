import React, { useState, useEffect } from "react";
import LanguageSelector from "./components/LanguageSelector";
import ShoppingList from "./components/ShoppingList";

function App() {
  const [items, setItems] = useState([]);
  const [listening, setListening] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [language, setLanguage] = useState("en-US");

  useEffect(() => {
    fetch("http://localhost:5000/api/items")
      .then(res => res.json())
      .then(setItems);

    fetch("http://localhost:5000/api/suggestions")
      .then(res => res.json())
      .then(data => setSuggestions(data.seasonal));
  }, []);

  const refreshItems = () => {
    fetch("http://localhost:5000/api/items")
      .then(res => res.json())
      .then(setItems);
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.start();
    setListening(true);

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("🎤 Heard:", transcript);

      await fetch("http://localhost:5000/api/voice-command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: transcript, lang: language }),
      });

      refreshItems();
      setListening(false);
    };

    recognition.onerror = () => setListening(false);
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Voice Shopping Assistant</h1>

      <LanguageSelector language={language} setLanguage={setLanguage} />

      <br />
      <button onClick={startListening} disabled={listening}>
        {listening ? "Listening..." : "🎤 Speak"}
      </button>

      <ShoppingList items={items} />

      <h2>Smart Suggestions</h2>
      <ul>
        {suggestions.map((s, i) => <li key={i}>{s}</li>)}
      </ul>
    </div>
  );
}

export default App;
