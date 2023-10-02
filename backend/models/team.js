const mongoose = require('mongoose');
const team = new mongoose.Schema({
    team_name: String,
    userId: String,
    tournamentId : String,
    players :[{ type: mongoose.Schema.Types.ObjectId, ref: 'player' }],
});

module.exports = mongoose.model('team', team);