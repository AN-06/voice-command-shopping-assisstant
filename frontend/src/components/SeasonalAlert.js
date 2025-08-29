import React, { useEffect, useState } from "react";

export default function SeasonalAlert({ suggestions = [], onAdd }) {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    if (!suggestions.length) return;

    let i = 0;
    let hideTimer = null;

    // show the first item immediately
    const show = (idx) => {
      setCurrent(suggestions[idx]);
      setVisible(true);
      // hide after 5s (matches animation duration)
      hideTimer = setTimeout(() => setVisible(false), 5000);
    };

    show(i);

    // then rotate every 7s
    const rotate = setInterval(() => {
      i = (i + 1) % suggestions.length;
      show(i);
    }, 7000);

    return () => {
      clearInterval(rotate);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [suggestions]);

  if (!visible || !current) return null;

  return (
    <>
      {/* Inline keyframes so no external CSS file is required */}
      <style>
        {`
          @keyframes slideInOut {
            0%   { transform: translateX(100%); opacity: 0; }
            10%  { transform: translateX(0);     opacity: 1; }
            90%  { transform: translateX(0);     opacity: 1; }
            100% { transform: translateX(100%);  opacity: 0; }
          }
        `}
      </style>

      <div
        style={{
          position: "fixed",
          top: "20%",
          right: 0,
          width: 320,
          background: "#fef9c3", // soft yellow
          borderLeft: "6px solid #f59e0b", // amber
          padding: 20,
          borderRadius: "12px 0 0 12px",
          boxShadow: "-6px 0 24px rgba(0,0,0,0.2)",
          zIndex: 1000,
          fontFamily: "Arial, sans-serif",
          animation: "slideInOut 5s ease",
        }}
      >
        <h3 style={{ margin: "0 0 10px", fontSize: 18 }}>🌟 Seasonal Pick</h3>
        <p style={{ margin: "0 0 14px", fontWeight: "bold", fontSize: 16 }}>
          {current}
        </p>

        <button
          onClick={() => onAdd && onAdd(current)}
          style={{
            padding: "10px 14px",
            border: "none",
            borderRadius: 8,
            background: "#22c55e",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
          }}
          aria-label={`Add ${current} to list`}
        >
          + Add to List
        </button>
      </div>
    </>
  );
}
