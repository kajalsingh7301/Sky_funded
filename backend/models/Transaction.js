const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true, // Ensures no duplicate transaction IDs
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "failed"], // Optional: restrict to valid status
      default: "pending",
    },
    date: {
      type: Date,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // Optional: adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
