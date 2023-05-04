const AuthController = require('../controllers/AuthController');
const express = require("express");
const { check } = require("express-validator");
const Developer = require("../models").Developer;
const Customer = require("../models").Customer;
const {
    Op
} = require('sequelize');
const router = express.Router();

// router.get('/', AuthController.getData);

router.post('/register-developer', 
check("firstName").isLength({ max: 32 }).withMessage("First Name is required!"),
check("lastName").isLength({ max: 32 }).withMessage("Last Name is required!"),
check("email").isEmail().withMessage("E-mail format doesn't match!"),
check("email").custom((value) => {
    return Developer.findOne({ where: { email: value } }).then((user) => {
        if (user) {
            return Promise.reject("E-mail already registered!");
        }
    })
}),
check("username").isLength({ min: 8 }).withMessage("Username minimum length 8 characters!"),
check("username").custom((value) => {
    return Developer.findOne({ where: { username: value } }).then((user) => {
        if (user) {
            return Promise.reject("Username already registered!");
        }
    })
}),
check("password").isLength({ min : 8 }).withMessage("Password length minimum 8 characters!"),
check("passwordConfirmation").custom((value, { req }) => {
    if (value !== req.body.password)
        return Promise.reject("Confirmation Password is not match!")
    return true;
}),
AuthController.RegisterDeveloper);

router.post('/register-customer', 
check("developerId").custom((value) => {
    return Developer.findOne({ where: { id: value } }).then((user) => {
        if (!user) {
            return Promise.reject("Developer Id not found!");
        }
    })
}),
check("firstName").isLength({ max: 32 }).withMessage("First Name is required!"),
check("lastName").isLength({ max: 32 }).withMessage("Last Name is required!"),
check("email").isEmail().withMessage("E-mail format doesn't match!"),
check("email").custom((value) => {
    return Customer.findOne({ where: { email: value } }).then((user) => {
        if (user) {
            return Promise.reject("E-mail already registered!");
        }
    })
}),
check("phoneNumber").isNumeric().withMessage("Phone Number must be numeric!"),
check("phoneNumber").isLength({ min: 11, max: 13 }).withMessage("Phone Number uncorrect length!"),
check("username").isLength({ min: 8 }).withMessage("Username minimum length 8 characters!"),
check("username").custom((value) => {
    return Customer.findOne({ where: { username: value } }).then((user) => {
        if (user) {
            return Promise.reject("Username already registered!");
        }
    })
}),
check("password").isLength({ min : 8 }).withMessage("Password length minimum 8 characters!"),
check("passwordConfirmation").custom((value, { req }) => {
    if (value !== req.body.password)
        return Promise.reject("Confirmation Password is not match!")
    return true;
}),
AuthController.RegisterCustomer);

module.exports = router;