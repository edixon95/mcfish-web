const express = require('express');
const db = require('../db');
const router = express.Router();

// GET all fish
router.get('/get', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM menus');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/add', async (req, res) => {
    try {
        const { name, size, menu_inventory } = req.body;

        const invJSON = JSON.stringify(menu_inventory);
        const [result] = await db.query(
            'INSERT INTO fish (name, size, menu_inventory) VALUES (?, ?, ?)',
            [name, size, invJSON]
        );
        res.json({ id: result.insertId, name, rarity });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/update', async (req, res) => {
    try {
        const { id, name, size, menu_inventory } = req.body;

        if (!menu_inventory) {
            return res.status(400).json({ error: "menu_inventory required" });
        }

        if (!id || id === 0) {
            return res.status(400).json({ error: "Item must exist with an ID" });
        }
        const invJSON = JSON.stringify(menu_inventory);
        await db.query(
            'UPDATE menus SET name = ?, size = ?, menu_inventory = ? WHERE id = ?',
            [name, size, invJSON, id]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;