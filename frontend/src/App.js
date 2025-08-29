import React, { useState, useEffect } from "react";
import LanguageSelector from "./components/LanguageSelector";
import ShoppingList from "./components/ShoppingList";
import SeasonalAlert from "./components/SeasonalAlert";

function App() {
  const [items, setItems] = useState([]);
  const [listening, setListening] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [language, setLanguage] = useState("en-US");

  useEffect(() => {
    fetch("http://localhost:5000/api/items")
      .then((res) => res.json())
      .then(setItems)
      .catch(() => {});

    fetch("http://localhost:5000/api/suggestions")
      .then((res) => res.json())
      .then((data) => setSuggestions(data.seasonal || []))
      .catch(() => {});
  }, []);

  const refreshItems = () => {
    fetch("http://localhost:5000/api/items")
      .then((res) => res.json())
      .then(setItems)
      .catch(() => {});
  };

  const changeQty = (id, delta) =>
    fetch(`http://localhost:5000/api/items/${id}/quantity`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ delta }),
    }).then(() => refreshItems());

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("SpeechRecognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.start();
    setListening(true);

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      try {
        await fetch("http://localhost:5000/api/voice-command", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: transcript, lang: language }),
        });
        refreshItems();
      } finally {
        setListening(false);
      }
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
  };

  // ---------- styles ----------
  const pageStyle = {
    minHeight: "100vh",
    background: "#fffaf0", // very light warm background
    fontFamily: "Arial, sans-serif",
  };

  const container = {
    maxWidth: 920,
    margin: "0 auto",        // <-- centers the whole app
    padding: "32px 24px",
  };

  const title = {
    fontSize: 42,
    margin: "0 0 16px",
    color: "#0f172a", // slate-900
  };

  const row = { display: "flex", alignItems: "center", gap: 12, margin: "12px 0 20px" };

  const speakBtn = {
    padding: "8px 14px",
    border: "none",
    borderRadius: 10,
    background: "#22c55e", // lettuce green
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  };

  const sectionTitle = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 28,
    margin: "24px 0 12px",
    color: "#111827",
  };

  return (
    <div style={pageStyle}>
      <div style={container}>
        <h1 style={title}>Voice Shopping Assistant</h1>

        <div style={row}>
          <label style={{ fontWeight: 600 }}>Select Language:</label>
          <LanguageSelector language={language} setLanguage={setLanguage} />
        </div>

        <button onClick={startListening} disabled={listening} style={speakBtn}>
          {listening ? "Listening..." : "🎤 Speak"}
        </button>

        <div style={sectionTitle}>
          <span role="img" aria-label="cart">🛒</span>
          <span>Shopping List</span>
        </div>

        <ShoppingList
          items={items}
          onInc={(id) => changeQty(id, +1)}
          onDec={(id) => changeQty(id, -1)}
        />

        <SeasonalAlert
          suggestions={suggestions}
          onAdd={(item) => {
            fetch("http://localhost:5000/api/items", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: item,
                category: "seasonal",
                quantity: 1,
              }),
            }).then(() => refreshItems());
          }}
        />
      </div>
    </div>
  );
}

export default App;
