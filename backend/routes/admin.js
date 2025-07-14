const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");
const User = require("../models/User");

const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// ------------------ ADMIN LOGIN ------------------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required" });
  }

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        role: "admin", 
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      message: "Login successful",
    });
  } catch (err) {
    console.error("Login error:", err);
    res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});


router.get(
  "/all-users",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const users = await User.find({}, "-password");
      res.json(users);
    } catch (err) {
      console.error("Error fetching users:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);


router.delete(
  "/delete-user/:userId",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const userId = req.params.userId;

      const deletedUser = await User.findByIdAndDelete(userId);
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        message: "User deleted successfully",
        deletedUser,
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  }
);

// ------------------ UPDATE USER BY ID (Admin Only) ------------------
router.put(
  "/update-user/:userId",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const userId = req.params.userId;
      const updates = req.body;

      // Block password updates through this route
      if (updates.password || updates.confirmPassword) {
        return res.status(400).json({
          message: "Password update not allowed here",
        });
      }

      const updatedUser = await User.findByIdAndUpdate(userId, updates, {
        new: true,
        runValidators: true,
      });

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        message: "User updated successfully",
        updatedUser,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  }
);

module.exports = router;
