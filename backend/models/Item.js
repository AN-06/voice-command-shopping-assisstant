const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  name: String,
  category: { type: String, default: "uncategorized" },
  quantity: { type: Number, default: 1 },
});

module.exports = mongoose.model("Item", ItemSchema);
