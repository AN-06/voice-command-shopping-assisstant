import React from "react";

function ShoppingList({ items }) {
  return (
    <div>
      <h2>🛒 Shopping List</h2>
      <ul>
        {items.map(item => (
          <li key={item._id}>{item.name} ({item.quantity})</li>
        ))}
      </ul>
    </div>
  );
}

export default ShoppingList;
