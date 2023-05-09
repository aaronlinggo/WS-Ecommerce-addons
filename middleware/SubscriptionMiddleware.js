const Developer = require("../models").Developer;
const jwt = require('jsonwebtoken');
require("dotenv").config();

const subscriptionMiddleware = async (req, res, next) => {
    var token = req.header("x-auth-token");
    try {
        userlogin = jwt.verify(token, process.env.JWT_KEY);
        let dev = await Developer.findOne({
            attribues: ["username", "subscriptionId", "expiredSubscription"],
            where: {
                username: userlogin.username
            }
        });
        if (dev.dataValues.subscriptionId == 1){
            throw 'Your Subscription is BASIC, please upgrade to PREMIUM!';
        }
        next();
    } catch (err) {
        return res.formatter.unauthorized("Unauthorized");
    }
};

module.exports = {
    subscriptionMiddleware
};