const mongoose = require('mongoose');
const match = new mongoose.Schema({
    team_name: [String],
    userId: String,
    tournamentId: String,
    score: { type: [Number], default: null },
    wicket: { type: [Number], default: null },
    over: { type: [Number], default: null },
    toss: { type: String },
    toss_status: { type: String },
    winner: String,
    venue: String,
    total_over: Number,
});

module.exports = mongoose.model('match', match);