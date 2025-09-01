import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import listRoutes from "./routes/listRoutes.js";

dotenv.config();
const app = express();

// ✅ Allowed origins (add your Firebase hosting domain here)
const allowedOrigins = [
  "http://localhost:5173",                  // local dev
  "https://voice-command-assisstant.web.app",  // Firebase hosting
  "https://voice-command-assisstant.firebaseapp.com" // Firebase alt domain
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());

// ✅ MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/list", listRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
