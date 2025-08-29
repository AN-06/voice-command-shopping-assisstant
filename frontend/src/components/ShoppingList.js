import React from "react";

function ShoppingList({ items, onInc, onDec }) {
  const btn = {
    padding: "4px 10px",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 700,
  };
  const minus = { ...btn, background: "#ef4444", color: "#fff" };   // tomato
  const plus  = { ...btn, background: "#f59e0b", color: "#fff" };   // mango/carrot

  return (
    <ul style={{ listStyle: "none", paddingLeft: 0 }}>
      {items.map((item) => (
        <li key={item._id} style={{ marginBottom: 10 }}>
          <span style={{ marginRight: 12 }}>{item.name} ({item.quantity})</span>
          <button style={{ ...minus, marginRight: 8 }} onClick={() => onDec(item._id)} aria-label={`decrease ${item.name}`}>−</button>
          <button style={plus} onClick={() => onInc(item._id)} aria-label={`increase ${item.name}`}>+</button>
        </li>
      ))}
    </ul>
  );
}

export default ShoppingList;
