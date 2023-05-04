const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const { validationResult } = require("express-validator");
require("dotenv").config();

const Customer = require('../models').Customer;
const Developer = require('../models').Developer;
const {
    Op
} = require('sequelize');

const RegisterDeveloper = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.formatter.badRequest(errors.mapped());
    }
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
            username: username
        });
        return res.formatter.created(dev);
    } catch (error) {
        console.log(error);
        return res.formatter.badRequest(errors);
    }
};

const RegisterCustomer = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.formatter.badRequest(errors.mapped());
    }
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
        return res.formatter.badRequest(errors);
    }
};

// const getData = async (req, res) => {
//     let dev = await Developer.findAll({
//         include: [{
//             model: Customer,
//             attributes: ['firstName', 'lastName']
//         }]
//     });
//     return res.formatter.ok(dev);
// };

// const LoginDeveloper = async (req, res) => {
//     const {
//         username,
//         password
//     } = req.body;

//     let dev = await Developer.findOne({
//         attributes: ["username"],
//         where: {
//             username: username,
//             password: password
//         },
//     });

//     if (!dev){
//         return res.status(404).send("username tidak terdaftar");
//     }

//     if (!bcrypt.compareSync(password, dev.password)) {
//         return res.status(400).send("Invalid Password");
//     } else {
//         var token = jwt.sign({
//                 "nrp": nrp,
//                 "role": result[0].role
//             },
//             process.env.JWT_KEY, {
//                 expiresIn: '500m'
//             }
//         );
//         return res.status(200).send(dev);
//     }
// };

// self.checkUsernameDeveloper = async (username) => {
//     const check = await Developer.findOne({
//         where:{
//             username: username,

//         }
//     });

//     if (check)
//         return true;
//     else
//         return false;
// };

// self.checkEmailDeveloper = async (email) => {
//     const check = await Developer.findOne({
//         where:{
//             email: email,

//         }
//     });

//     if (check)
//         return true;
//     else
//         return false;
// };

// self.checkUsernameCustomer = async (username) => {
//     const check = await Customer.findOne({
//         where:{
//             username: username,

//         }
//     });

//     if (check)
//         return true;
//     else
//         return false;
// };

// self.checkEmailCustomer = async (email) => {
//     const check = await Customer.findOne({
//         where:{
//             email: email,

//         }
//     });

//     if (check)
//         return true;
//     else
//         return false;
// };

module.exports = { RegisterDeveloper, RegisterCustomer };