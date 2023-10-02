const User = require("../models/user");

exports.isauthenticated = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        req.userId = token
        next()
    }
    catch (error) {
        console.log(error.message)
    }
}