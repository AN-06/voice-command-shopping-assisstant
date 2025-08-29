const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  key: { type: String, required: true, unique: true }, // normalized name (e.g., "watermelon")
  category: { type: String, default: "uncategorized" },
  quantity: { type: Number, default: 1 },
});

// Fast lookup & uniqueness on normalized key
ItemSchema.index({ key: 1 }, { unique: true });

module.exports = mongoose.model("Item", ItemSchema);
