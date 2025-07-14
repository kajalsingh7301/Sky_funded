// backend/controllers/depositController.js (example)

const Deposit = require('../models/Deposit');

exports.createDeposit = async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;
    const screenshotUrl = req.file ? `/uploads/deposits/${req.file.filename}` : null;

    const newDeposit = new Deposit({
      user: req.user._id,
      amount,
      paymentMethod,
      screenshotUrl,
    });

    await newDeposit.save();
    res.status(201).json({ success: true, deposit: newDeposit });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getAllDeposits = async (req, res) => {
  try {
    const deposits = await Deposit.find().populate('user', 'username email');
    res.json({ deposits, total: deposits.length });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getUserDeposits = async (req, res) => {
  try {
    const deposits = await Deposit.find({ user: req.user._id });
    res.json({ deposits, total: deposits.length });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.findDepositById = async (id) => {
  return await Deposit.findById(id);
};

exports.deleteDeposit = async (req, res) => {
  try {
    const deposit = await Deposit.findByIdAndDelete(req.params.id);
    if (!deposit) return res.status(404).json({ msg: 'Deposit not found' });
    res.json({ msg: 'Deposit deleted' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};
