const express = require('express');
const db = require('../db');
const router = express.Router();

// GET all players
router.get('/get', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM players');

        // Convert inventory JSON string to JS array/object
        const players = rows.map(player => {
            if (player.inventory) {
                try {
                    player.inventory = JSON.parse(player.inventory);
                } catch (e) {
                    console.error('Failed to parse inventory for player', player.name, e);
                    player.inventory = []; // fallback
                }
            } else {
                player.inventory = [];
            }
            return player;
        });

        res.json(players);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/poll', async (req, res) => {
    try {
        const { playerName } = req.query;

        if (!playerName) {
            return res.status(400).json({ error: 'playerName query parameter is required' });
        }

        // Query for a single player
        const [rows] = await db.query('SELECT * FROM players WHERE name = ?', [playerName]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Player not found' });
        }

        const player = rows[0];

        // Convert inventory JSON string to JS array/object
        if (player.inventory) {
            try {
                player.inventory = JSON.parse(player.inventory);
            } catch (e) {
                console.error('Failed to parse inventory for player', player.name, e);
                player.inventory = []; // fallback
            }
        } else {
            player.inventory = [];
        }

        res.json(player); // return a single object
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Example: UPDATE player (adjust according to your table structure)
router.post('/update', async (req, res) => {
    try {
        const { id, name, score } = req.body;
        const [result] = await db.query(
            'UPDATE players SET name = ?, score = ? WHERE id = ?',
            [name, score, id]
        );
        res.json({ affectedRows: result.affectedRows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;