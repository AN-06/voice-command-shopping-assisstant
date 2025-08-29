const express = require("express");
const translate = require("@vitalets/google-translate-api");
const Item = require("../models/Item");
const parseCommand = require("../utils/nlp");

const router = express.Router();

router.post("/", async (req, res) => {
  const { text, lang } = req.body;

  try {
    let translatedText = text;
    if (lang !== "en-US") {
      const result = await translate(text, { from: lang.split("-")[0], to: "en" });
      translatedText = result.text;
    }

    const { intent, item, quantity } = parseCommand(translatedText);

    if (intent === "add" && item) {
      const newItem = new Item({ name: item, quantity });
      await newItem.save();
      return res.json({ action: "added", item, quantity, langText: text });
    }

    if (intent === "remove" && item) {
      const found = await Item.findOne({ name: item });
      if (found) {
        await Item.findByIdAndDelete(found._id);
        return res.json({ action: "removed", item, langText: text });
      }
    }

    if (intent === "search" && item) {
      const found = await Item.find({ name: new RegExp(item, "i") });
      return res.json({ action: "searched", results: found, langText: text });
    }

    res.json({ action: "unknown", text });
  } catch (err) {
    res.status(500).json({ error: "Translation or NLP failed", details: err.message });
  }
});

module.exports = router;
