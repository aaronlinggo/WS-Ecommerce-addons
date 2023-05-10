const Customer = require("../models").Customer;
const Developer = require("../models").Developer;
const jwt = require('jsonwebtoken');
// require("dotenv").config();
const {
    sequelize
} = require('../models');

const getAll = async (req, res) => {
    var token = req.header("x-auth-token");
    dev = jwt.verify(token, process.env.JWT_KEY);
    let customers = await Customer.findAll({
        attributes: ['id', 'developerId', 'Customer.firstName', 'Customer.lastName', 'email', 'phoneNumber', 'username', 'password'],
        include: [{
            model: Developer,
            attributes: [
                [sequelize.fn('CONCAT', sequelize.col('Developer.firstName'), ' ', sequelize.col('Developer.lastName')), 'developer_name']
            ]
        }],
        where: {
            developerId: dev.id
        },
    });
    return res.status(200).send(customers);
}
module.exports = {
    getAll
}