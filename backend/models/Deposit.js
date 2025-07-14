// models/Deposit.js

const mongoose = require("mongoose");

const depositSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
      min: [10, 'Amount must be at least $10'],
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['usdt', 'eth', 'btc'],
    },
    screenshotUrl: {
      type: String,
      required: true,
    },
    user: { // Changed from userId to user
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Deposit", depositSchema);
