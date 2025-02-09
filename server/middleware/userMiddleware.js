const jwt = require('jsonwebtoken');
const { secret } = require('../models/User');

function userMiddleware(req, res, next) {

    try {
        const rawtoken = req.headers.authorization;
        const token = rawtoken.split(" ")
        const decode = jwt.verify(token[1], secret)
        if (decode.username) {
            req.headers.username = decode.username;
            next()
        }
        else {
            res.json({
                msg: "Invalid jwt token",
                data:token
            })
        }
    }
    catch (err) {
        res.status(500).json({
            msg:"Error in jwt middleware auth",
            data:err
        })
    }
}

module.exports = userMiddleware;