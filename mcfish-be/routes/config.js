const express = require('express');
const db = require('../db');
const router = express.Router();

// GET all fish
router.get('/get', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM config LIMIT 1');
        res.json(rows[0] || null);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// update
router.post('/update', async (req, res) => {
    try {
        const { player_inventory, version } = req.body;
        console.log(1)

        if (!player_inventory) {
            return res.status(400).json({ error: "player_inventory required" });
        }
        console.log(2)
        const invJSON = JSON.stringify(player_inventory);
        console.log(3)
        await db.query(
            'UPDATE config SET player_inventory = ?, version = ? WHERE id = 1',
            [invJSON, version || 0.1]
        );
        console.log(4)
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;