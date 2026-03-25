const express = require('express');
const cors = require('cors');

const playersRoutes = require('./routes/players');
const fishRoutes = require('./routes/fish');
const rarityRoutes = require('./routes/rarity_weights');
const menuRoutes = require('./routes/menus');
const configRoutes = require('./routes/config');

const app = express();
app.use(cors());
app.use(express.json());

// Mount routes with prefixes
app.use('/players', playersRoutes);
app.use('/fish', fishRoutes);
app.use('/rarity_weight', rarityRoutes);
app.use('/menus', menuRoutes);
app.use('/config', configRoutes);

app.listen(5000, () => console.log('Server running on http://localhost:5000'));