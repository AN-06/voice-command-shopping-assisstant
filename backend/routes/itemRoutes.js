const express = require("express");
const Item = require("../models/Item");
const router = express.Router();

const norm = (s = "") => s.trim().toLowerCase();

// Get all items
router.get("/", async (req, res) => {
  const items = await Item.find().sort({ name: 1 });
  res.json(items);
});

// Add item (increment qty if exists by normalized key)
router.post("/", async (req, res) => {
  const { name, category = "uncategorized", quantity = 1 } = req.body;
  if (!name) return res.status(400).json({ error: "name required" });

  const key = norm(name);
  // Upsert by key; increment quantity if exists
  const item = await Item.findOneAndUpdate(
    { key },
    {
      $inc: { quantity: Number(quantity || 1) },
      $setOnInsert: { name, key, category }
    },
    { new: true, upsert: true }
  );
  res.json(item);
});

// Change quantity (+/-). If becomes 0, delete.
router.patch("/:id/quantity", async (req, res) => {
  const { delta = 0 } = req.body;
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ error: "not found" });

  item.quantity = Math.max(0, (item.quantity || 0) + Number(delta));
  if (item.quantity === 0) {
    await Item.findByIdAndDelete(item._id);
    return res.json({ success: true, removed: true, id: req.params.id });
  }
  await item.save();
  res.json(item);
});

// Delete item
router.delete("/:id", async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// TEMP: one-time normalization to merge duplicates by key.
// Call once: POST http://localhost:5000/api/items/normalize
router.post("/normalize", async (_req, res) => {
  const all = await Item.find();
  const map = new Map();

  for (const it of all) {
    const key = it.key || norm(it.name);
    if (!map.has(key)) {
      map.set(key, { keep: it, sum: it.quantity || 0 });
    } else {
      const rec = map.get(key);
      rec.sum += it.quantity || 0;
      // delete duplicate doc
      await Item.findByIdAndDelete(it._id);
    }
  }

  // update kept docs with normalized key + summed quantity
  for (const [key, { keep, sum }] of map.entries()) {
    keep.key = key;
    keep.quantity = sum;
    await keep.save();
  }

  res.json({ merged: map.size, total: all.length });
});


module.exports = router;
