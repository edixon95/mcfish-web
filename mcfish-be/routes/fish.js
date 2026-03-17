const express = require('express');
const db = require('../db');
const router = express.Router();

// GET all fish
router.get('/get', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM fish');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Example: ADD new fish
router.post('/add', async (req, res) => {
    try {
        const { name, rarity } = req.body;
        const [result] = await db.query(
            'INSERT INTO fish (name, rarity) VALUES (?, ?)',
            [name, rarity]
        );
        res.json({ id: result.insertId, name, rarity });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;