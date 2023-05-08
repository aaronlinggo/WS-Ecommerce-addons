const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
require("dotenv").config();
const Customer = require('../models').Customer;
const Developer = require('../models').Developer;
const Subscription = require('../models').Subscription;
var moment = require('moment');
const {
    Op
} = require('sequelize');
const {
    sequelize
} = require('../models');

const RegisterDeveloper = async (req, res) => {
    const {
        firstName,
        lastName,
        email,
        password,
        username
    } = req.body;

    try {
        let dev = await Developer.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: bcrypt.hashSync(password, 12),
            username: username,
            subscriptionId: 1,
            expiredSubscription: null,
        });
        return res.formatter.created(dev);
    } catch (error) {
        console.log(error);
        return res.formatter.badRequest(error);
    }
};

const RegisterCustomer = async (req, res) => {
    const {
        developerId,
        firstName,
        lastName,
        email,
        phoneNumber,
        username,
        password
    } = req.body;

    try {
        let cust = await Customer.create({
            developerId: developerId,
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: phoneNumber,
            username: username,
            password: bcrypt.hashSync(password, 12)
        });
        return res.formatter.created(cust);
    } catch (error) {
        console.log(error);
        return res.formatter.badRequest(error);
    }
};

const LoginDeveloper = async (req, res) => {
    const {
        username,
        password
    } = req.body;

    let dev = await Developer.findOne({
        attributes: ["id", "username", "password", "email", "subscriptionId", [sequelize.fn('date', sequelize.col('expiredSubscription')), 'expiredSubscription']],
        include: [{
            model: Subscription,
            attributes: [
                "type"
            ]
        }],
        where: {
            username: username
        },
    });
    if (!dev) {
        return res.formatter.notFound("Username not registered!");
    }
    else {
        if (!bcrypt.compareSync(password, dev.dataValues.password)) {
            return res.formatter.badRequest("Invalid Password");
        } else {
            var token = jwt.sign({
                "id": dev.dataValues.id,
                "username": dev.dataValues.username,
                "email": dev.dataValues.email,
                "subscription": dev.Subscription.dataValues.type,
                "expiredSubscription": moment(dev.dataValues.expiredSubscription).format("MM-DD-YYYY")
            },
                process.env.JWT_KEY, {
                expiresIn: '500m'
            }
            );
            var response = {
                username: dev.dataValues.username,
                token: token
            }
            return res.formatter.ok(response);
        }
    }
};

const LoginCustomer = async (req, res) => {
    const {
        username,
        password
    } = req.body;

    let cust = await Customer.findOne({
        attributes: ["id", "username", "password", "email", "developerId"],
        where: {
            username: username
        },
    });
    if (!cust) {
        return res.formatter.notFound("Username not registered!");
    }
    else {
        if (!bcrypt.compareSync(password, cust.dataValues.password)) {
            return res.formatter.badRequest("Invalid Password");
        } else {
            var token = jwt.sign({
                "id": cust.dataValues.id,
                "username": cust.dataValues.username,
                "email": cust.dataValues.email,
                "developerId": cust.dataValues.developerId
            },
                process.env.JWT_KEY, {
                expiresIn: '500m'
            }
            );
            var response = {
                username: cust.dataValues.username,
                token: token
            }
            return res.formatter.ok(response);
        }
    }
};

module.exports = { RegisterDeveloper, RegisterCustomer, LoginDeveloper, LoginCustomer };