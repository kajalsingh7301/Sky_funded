const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const verifyToken = require('../middleware/verifyToken');

// GET all transactions for logged-in user
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized. User not found.' });
    }

    const transactions = await Transaction.find({ userId })
      .populate('userId', 'username')
      .sort({ date: -1 });

    res.json(transactions);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// POST create a new transaction for logged-in user
router.post('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized. User not found.' });
    }

    const { transactionId, amount, status, date } = req.body;

    if (!transactionId || !amount || !date) {
      return res.status(400).json({ error: 'transactionId, amount, and date are required' });
    }

    const newTransaction = new Transaction({
      transactionId,
      amount,
      status: status || 'pending',
      date,
      userId,
    });

    await newTransaction.save();

    const populatedTransaction = await Transaction.findById(newTransaction._id).populate('userId', 'username');

    res.status(201).json(populatedTransaction);
  } catch (err) {
    console.error('Add error:', err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Transaction ID must be unique.' });
    }
    res.status(500).json({ error: 'Failed to add transaction' });
  }
});

module.exports = router;
