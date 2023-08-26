const mongoose = require('mongoose');
const player = new mongoose.Schema({
    name :  String,
    type : String,
    batting_status:{ type: String, default: 'remaining' },
    batting_run : { type: Number, default: null },
    batting_ball : { type: Number, default: null },
    strike_rate : { type: Number, default: null },
    fours : { type: Number, default: null },
    sixes : { type: Number, default: null },
    bowling_run : { type: Number, default: null },
    bowling_ball : { type: Number, default: null },
    economy : {type : Number, default: null},
    wicket : {type : Number, default: null},
});

module.exports = mongoose.model('player', player);