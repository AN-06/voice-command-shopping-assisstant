const express = require("express");
const Item = require("../models/Item");
const router = express.Router();

// Get all items
router.get("/", async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

// Add item
router.post("/", async (req, res) => {
  const { name, category, quantity } = req.body;
  const newItem = new Item({ name, category, quantity });
  await newItem.save();
  res.json(newItem);
});

// Delete item
router.delete("/:id", async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
