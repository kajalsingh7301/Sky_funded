const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");

// Load environment variables
dotenv.config();

// Create express app
const app = express();

// ✅ Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ VERY IMPORTANT!

// Enable CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Set security headers
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// Serve uploads folder
app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "http://localhost:3000");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
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

// Routes
const verifyToken = require("./middleware/verifyToken");

const authRoutes = require("./routes/auth");
const contactRoutes = require("./routes/contact");
const userRoutes = require("./routes/userroutes");
const statsRoutes = require("./routes/stats");
const transactionRoutes = require("./routes/transactions");
const depositRoutes = require("./routes/deposit");
const adminRoutes = require("./routes/admin");
const kycRoutes = require("./routes/Kyc");
const approvedUsersRoutes = require("./routes/approvedUsers");
const userStatusRoutes = require("./routes/userStatus");

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/users", userRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/transactions", verifyToken, transactionRoutes);
app.use("/api/deposit", depositRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/kyc", kycRoutes);
app.use("/api/approved-users", approvedUsersRoutes);
app.use("/api/user-status", userStatusRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Hello from the SkyFunded backend!");
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ msg: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: "Internal server error", error: err.message });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
