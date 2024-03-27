const mongoose = require('mongoose');

const pointTable = new mongoose.Schema({
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'team', default: null },
    tournament: { type: mongoose.Schema.Types.ObjectId, ref: 'tournament', default: null },
    played_match: Number,
    win: Number,
    loss: Number,
    netRunrate: Number,
    tie: Number,
    point: Number
})
module.exports = mongoose.model('pointTable', pointTable);
