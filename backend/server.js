import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import managementRoutes from "./routes/managementRoutes.js";
import userRoutes from "./routes/patientRoutes.js";
import dietitianRoutes from "./routes/dietitianRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// Debugging Middleware - Log incoming requests
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.set("strictQuery", false);
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/management", managementRoutes);
app.use("/api/patient", userRoutes);
app.use("/api/dietitian", dietitianRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/profile", profileRoutes);


app.get("/", (req, res) => {
  res.send("✅ Hospital Food Management API is running...");
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
