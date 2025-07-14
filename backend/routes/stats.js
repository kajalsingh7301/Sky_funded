// routes/stats.js
const express = require('express');
const router = express.Router();

// Example route: GET /api/stats
router.get('/', (req, res) => {
  res.json({ message: 'Stats route is working!' });
});

module.exports = router;
