import express from "express";
import ShoppingList from "../models/ShoppingList.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware for auth
function auth(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token" });
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ msg: "Invalid token" });
  }
}

// Get list
router.get("/", auth, async (req, res) => {
  const list = await ShoppingList.findOne({ userId: req.user.id });
  res.json(list || { items: [] });
});

// Save list
router.post("/", auth, async (req, res) => {
  const { items } = req.body;
  let list = await ShoppingList.findOne({ userId: req.user.id });
  if (!list) {
    list = new ShoppingList({ userId: req.user.id, items });
  } else {
    list.items = items;
  }
  await list.save();
  res.json(list);
});

export default router;
