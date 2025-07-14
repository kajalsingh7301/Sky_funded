// (`✅ Server is running at http://localhost:${PORT}`);
// });

const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");

dotenv.config();

const app = express();
app.use(express.json());

// Allow cross-origin requests from frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// ✅ Serve static uploads with correct CORS headers
app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "http://localhost:3000");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin"); // ✅ This fixes the image loading issue
    next();
  },
  express.static(path.join(__dirname, "uploads"))
);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Import routes
const authRoutes = require("./routes/auth");
const contactRoutes = require("./routes/contact");
const userRoutes = require("./routes/userroutes");
const statsRoutes = require("./routes/stats");
const transactionRoutes = require("./routes/transactions");
const depositRoutes = require("./routes/deposit");
const adminRoutes = require("./routes/admin");
const verifyToken = require("./middleware/verifyToken");

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/user", userRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/transactions", verifyToken, transactionRoutes);
app.use("/api/deposit", depositRoutes);
app.use("/api/admin", adminRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Hello from the SkyFunded backend!");
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ msg: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: "Internal server error", error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
// const PORT =   5000;

app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
