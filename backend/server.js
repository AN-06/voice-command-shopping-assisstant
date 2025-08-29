const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const itemRoutes = require("./routes/itemRoutes");
const voiceRoutes = require("./routes/voiceRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/voice-shopping", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once("open", () => console.log("✅ MongoDB connected"));

// Routes
app.use("/api/items", itemRoutes);
app.use("/api/voice-command", voiceRoutes);

// Suggestions
app.get("/api/suggestions", (req, res) => {
  res.json({
    seasonal: ["Mangoes", "Watermelon", "Corn"],
    substitutes: {
      milk: ["Almond milk", "Soy milk"],
      bread: ["Brown bread", "Multigrain bread"],
    },
  });
});

app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
