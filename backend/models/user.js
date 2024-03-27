const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    type: String,
    email: String,
    password: String,
    img_url : String,
});

module.exports = mongoose.model('user', userSchema);