const mongoose = require('mongoose');

const tournamentschema = new mongoose.Schema({
    tournament_name: String,
    userId: String,
    capacity: Number,
    location: String,
    tournament_fee: Number,
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'team', default: null }]
});

module.exports = mongoose.model('tournament', tournamentschema);