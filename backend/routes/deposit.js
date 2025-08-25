const express = require("express");
const router = express.Router();
const Deposit = require("../models/Deposit");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");

// ✅ Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

/* ======================
   CREATE DEPOSIT (JSON)
====================== */
router.post("/", async (req, res) => {
  try {
    const { paymentMethod, amount, screenshot, userId } = req.body;
    if (!paymentMethod || !amount || !screenshot || !userId)
      return res.status(400).json({ error: "All fields are required" });

    const depositAmount = Number(amount);
    if (isNaN(depositAmount)) return res.status(400).json({ error: "Amount must be a number" });

    const foundUser = await User.findById(userId);
    if (!foundUser) return res.status(404).json({ error: "User not found" });

    const newDeposit = new Deposit({
      paymentMethod,
      amount: depositAmount,
      screenshot,
      userId: foundUser._id,
    });

    await newDeposit.save();
    await newDeposit.populate("userId", "username email balance totalDeposit");

    res.status(201).json({ success: true, message: "Deposit added", deposit: newDeposit });
  } catch (err) {
    console.error("Deposit Create Error:", err.message);
    res.status(500).json({ error: "Server error while creating deposit" });
  }
});

/* ======================
   CREATE DEPOSIT (FormData with file)
====================== */
router.post("/save", upload.single("screenshot"), async (req, res) => {
  try {
    const { paymentMethod, amount, username } = req.body;
    if (!paymentMethod || !amount || !username)
      return res.status(400).json({ error: "All fields are required" });

    const depositAmount = Number(amount);
    if (isNaN(depositAmount)) return res.status(400).json({ error: "Amount must be a number" });

    const foundUser = await User.findOne({ username });
    if (!foundUser) return res.status(404).json({ error: "User not found" });

    const screenshot = req.file ? `/uploads/${req.file.filename}` : null;

    const newDeposit = new Deposit({
      paymentMethod,
      amount: depositAmount,
      screenshot,
      userId: foundUser._id,
    });

    await newDeposit.save();
    await newDeposit.populate("userId", "username email balance totalDeposit");

    res.status(201).json({ success: true, message: "Deposit saved", deposit: newDeposit });
  } catch (err) {
    console.error("Deposit Save Error:", err.message);
    res.status(500).json({ error: "Server error while saving deposit" });
  }
});

/* ======================
   GET deposits for a specific username (with user details)
====================== */
router.get("/user/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const deposits = await Deposit.find({ userId: user._id })
      .populate("userId", "username email balance totalDeposit")
      .sort({ createdAt: -1 });

    // ✅ Always return 200 with empty array if no deposits found
    return res.status(200).json(deposits);
  } catch (err) {
    console.error("User Deposits Fetch Error:", err.message);
    res.status(500).json({ error: "Server error while fetching user deposits" });
  }
});

/* ======================
   GET USER STATS BY ID
====================== */
router.get("/user/:userId/stats", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("balance totalDeposit username email");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ success: true, balance: user.balance || 0, totalDeposit: user.totalDeposit || 0, user });
  } catch (err) {
    console.error("User Stats Error:", err.message);
    res.status(500).json({ error: "Server error while fetching user stats" });
  }
});

/* ======================
   GET ALL DEPOSITS with pagination
====================== */
router.get("/", async (req, res) => {
  try {
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    const deposits = await Deposit.find()
      .populate({
        path: "userId",
        select: "username email balance totalDeposit",
        options: { strictPopulate: false },
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Deposit.countDocuments();

    res.status(200).json({ success: true, total, page, limit, deposits });
  } catch (err) {
    console.error("Deposit Fetch Error:", err.message);
    res.status(500).json({ error: "Server error while fetching deposits" });
  }
});

/* ======================
   GET SINGLE DEPOSIT
====================== */
router.get("/:id", async (req, res) => {
  try {
    const deposit = await Deposit.findById(req.params.id)
      .populate("userId", "username email balance totalDeposit");
    if (!deposit) return res.status(404).json({ error: "Deposit not found" });
    res.status(200).json(deposit);
  } catch (err) {
    console.error("Deposit Fetch Single Error:", err.message);
    res.status(500).json({ error: "Server error while fetching deposit" });
  }
});

/* ======================
   UPDATE DEPOSIT
====================== */
router.put("/:id", async (req, res) => {
  try {
    if (req.body.amount) req.body.amount = Number(req.body.amount);
    const updatedDeposit = await Deposit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedDeposit) return res.status(404).json({ error: "Deposit not found" });

    await updatedDeposit.populate("userId", "username email balance totalDeposit");
    res.status(200).json({ success: true, message: "Deposit updated", deposit: updatedDeposit });
  } catch (err) {
    console.error("Deposit Update Error:", err.message);
    res.status(500).json({ error: "Server error while updating deposit" });
  }
});

/* ======================
   UPDATE STATUS (Admin)
====================== */
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "approved", "declined"].includes(status))
      return res.status(400).json({ error: "Invalid status value" });

    const deposit = await Deposit.findById(req.params.id).populate("userId");
    if (!deposit) return res.status(404).json({ error: "Deposit not found" });

    if (status === "approved" && deposit.status !== "approved") {
      const user = await User.findById(deposit.userId._id);
      if (user) {
        const amountNum = Number(deposit.amount);
        user.totalDeposit = (user.totalDeposit || 0) + amountNum;
        user.balance = (user.balance || 0) + amountNum;
        await user.save();
      }
    }

    deposit.status = status;
    await deposit.save();
    await deposit.populate("userId", "username email balance totalDeposit");

    res.status(200).json({ success: true, message: `Deposit ${status}`, deposit });
  } catch (err) {
    console.error("Deposit Status Update Error:", err.message);
    res.status(500).json({ error: "Server error while updating deposit status" });
  }
});

/* ======================
   DELETE DEPOSIT
====================== */
router.delete("/:id", async (req, res) => {
  try {
    const deletedDeposit = await Deposit.findByIdAndDelete(req.params.id);
    if (!deletedDeposit) return res.status(404).json({ error: "Deposit not found" });
    res.status(200).json({ success: true, message: "Deposit deleted" });
  } catch (err) {
    console.error("Deposit Delete Error:", err.message);
    res.status(500).json({ error: "Server error while deleting deposit" });
  }
});

module.exports = router;
