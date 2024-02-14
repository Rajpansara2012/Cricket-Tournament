const mongoose = require('mongoose');
const graph = new mongoose.Schema({
    run: { type: Number, default: 0 },
    strike_rate: { type: Number, default: 0 },
    economy: { type: Number, default: 0 },
    wicket: { type: Number, default: 0 },
    status: {String},
    bowling_ball : {type:Number},
    player: String
});

module.exports = mongoose.model('graph', graph);