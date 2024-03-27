const User = require("../models/user");

exports.isauthenticated = async (req, res, next) => {
    try {
        // console.log(req.cookies)
        const { token } = req.cookies;
        // console.log(token)
        req.userId = token
        next()
    }
    catch (error) {
        console.log(error.message)
    }
}