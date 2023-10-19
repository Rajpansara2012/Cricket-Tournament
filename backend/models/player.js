const mongoose = require('mongoose');
const player = new mongoose.Schema({
    name: String,
    type: String,
    batting_status: { type: String, default: 'remaining' },
    batting_run: { type: Number, default: 0 },
    batting_ball: { type: Number, default: 0 },
    strike_rate: { type: Number, default: 0 },
    fours: { type: Number, default: 0 },
    sixes: { type: Number, default: 0 },
    bowling_run: { type: Number, default: 0 },
    bowling_ball: { type: Number, default: 0 },
    economy: { type: Number, default: 0 },
    wicket: { type: Number, default: 0 },
});

module.exports = mongoose.model('player', player);