const Developer = require("../models").Developer;
const Customer = require("../models").Customer;
const jwt = require('jsonwebtoken');
require("dotenv").config();

const developerMiddleware = async (req, res, next) => {
    var token = req.header("x-auth-token");
    try {
        userlogin = jwt.verify(token, process.env.JWT_KEY);
        let dev = await Developer.findOne({
            attribues: ["username"],
            where: {
                username: userlogin.username
            }
        });
        if (!dev) {
            throw 'Unauthorized';
        } else {
            next();
        }
    } catch (err) {
        return res.formatter.unauthorized("Unauthorized");
    }
};

module.exports = {
    authMiddleware,
    developerMiddleware,
    customerMiddleware
};