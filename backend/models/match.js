const mongoose = require('mongoose');
const player = require('./player');
const match = new mongoose.Schema({
    team_name: [String],
    teamId : [String],
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
    players1 : { type: [], default: null },
    players2 : { type: [], default: null },
});

module.exports = mongoose.model('match', match);