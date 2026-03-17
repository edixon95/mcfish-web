const express = require('express');
const db = require('../db');
const router = express.Router();

// GET all rarity weights
router.get('/get', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM rarity_weight');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;