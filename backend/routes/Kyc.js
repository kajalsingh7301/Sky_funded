const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const Kyc = require("../models/Kyc");
const authenticateToken = require("../middleware/authenticateToken"); // ✅ added

// Ensure uploads directory exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPEG, PNG, and PDF files are allowed."), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// POST /api/kyc - User submits KYC
router.post(
  "/",
  authenticateToken, // ✅ token check added
  upload.fields([{ name: "idFront" }, { name: "idBack" }]),
  async (req, res) => {
    try {
      const { fullName, dob, documentType } = req.body;
      const userId = req.user.id; // ✅ extracted from token

      const idFront = req.files?.idFront?.[0]?.path;
      const idBack = req.files?.idBack?.[0]?.path || "";

      if (!userId || !fullName || !dob || !documentType || !idFront) {
        return res.status(400).json({ msg: "All required fields must be filled." });
      }

      const existingKyc = await Kyc.findOne({ userId });
      if (existingKyc) {
        return res.status(400).json({ msg: "KYC already submitted." });
      }

      const newKyc = new Kyc({
        userId,
        fullName,
        dob,
        documentType,
        idFront,
        idBack,
      });

      await newKyc.save();
      return res.status(201).json({ msg: "KYC submitted successfully." });
    } catch (error) {
      console.error("Error submitting KYC:", error);
      return res.status(500).json({ msg: "Server error while submitting KYC." });
    }
  }
);

// GET /api/kyc - Admin: Fetch all KYC submissions
router.get("/", async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const kycs = await Kyc.find(filter).sort({ submittedAt: -1 });
    return res.status(200).json(kycs);
  } catch (error) {
    console.error("Error fetching KYC data:", error);
    return res.status(500).json({ msg: "Server error while fetching KYC data." });
  }
});

// PUT /api/kyc/:id/status - Admin updates KYC status
router.put("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status." });
    }

    const kyc = await Kyc.findById(id);
    if (!kyc) {
      return res.status(404).json({ msg: "KYC record not found." });
    }

    kyc.status = status;
    kyc.rejectionReason = status === "rejected" ? (rejectionReason || "Not specified") : "";
    await kyc.save();

    return res.status(200).json({ msg: `KYC ${status} successfully.` });
  } catch (error) {
    console.error("Error updating KYC status:", error);
    return res.status(500).json({ msg: "Server error while updating KYC status." });
  }
});



// GET /api/kyc/user/:userId - User views own KYC
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const kyc = await Kyc.findOne({ userId });
    if (!kyc) {
      return res.status(404).json({ msg: "KYC not found for this user." });
    }
    return res.status(200).json(kyc);
  } catch (error) {
    console.error("Error fetching user KYC:", error);
    return res.status(500).json({ msg: "Server error while fetching user KYC." });
  }
});

module.exports = router;


