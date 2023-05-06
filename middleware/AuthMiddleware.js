const Developer = require("../models").Developer;
const Customer = require("../models").Customer;
const jwt = require('jsonwebtoken');
require("dotenv").config();

const authMiddleware = (req, res, next) => {
    var token = req.header("x-auth-token");
    try {
        userlogin = jwt.verify(token, process.env.JWT_KEY);
        next();
    } catch (err) {
        return res.formatter.unauthorized("Unauthorized");
    }
};

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

const customerMiddleware = async (req, res, next) => {
    var token = req.header("x-auth-token");
    try {
        userlogin = jwt.verify(token, process.env.JWT_KEY);
        let cust = await Customer.findOne({
            attribues: ["username"],
            where: {
                username: userlogin.username
            }
        });
        if (!cust) {
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