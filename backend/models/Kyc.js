const mongoose = require("mongoose");

const kycSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"],
  },
  fullName: {
    type: String,
    required: [true, "Full name is required"],
    trim: true,
  },
  dob: {
    type: String,
    required: [true, "Date of birth is required"],
    trim: true,
  },
  documentType: {
    type: String,
    required: [true, "Document type is required"],
    trim: true,
  },
  idFront: {
    type: String,
    required: [true, "Front side of ID is required"],
    trim: true,
  },
  idBack: {
    type: String,
    trim: true, // Optional
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  rejectionReason: {
    type: String,
    default: "",
    trim: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

// ✅ Use existing model if already declared (to avoid OverwriteModelError)
module.exports = mongoose.models.Kyc || mongoose.model("Kyc", kycSchema);
