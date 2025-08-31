import mongoose from "mongoose";

const shoppingItemSchema = new mongoose.Schema({
  item: String,
  quantity: Number,
  modifiers: [String],
  category: String,
  completed: { type: Boolean, default: false }
});

const shoppingListSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [shoppingItemSchema]
}, { timestamps: true });

export default mongoose.model("ShoppingList", shoppingListSchema);
[]