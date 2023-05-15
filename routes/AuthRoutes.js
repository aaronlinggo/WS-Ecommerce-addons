const AuthController = require('../controllers/AuthController');
const express = require("express");
const {
    check
} = require("express-validator");
const Developer = require("../models").Developer;
const Customer = require("../models").Customer;
const validationMiddleware = require("../middleware/ValidationMiddleware")
const {
    Op
} = require('sequelize');
const router = express.Router();

router.get('/verify/:developerId/:token', AuthController.verifyEmail);
router.get('/verified', AuthController.verifiedEmail);

router.post('/register-developer',
    check("firstName").isLength({
        max: 32
    }).withMessage("First Name is required!"),
    check("lastName").isLength({
        max: 32
    }).withMessage("Last Name is required!"),
    check("shop").isLength({
        max: 32
    }).withMessage("Shop is required!"),
    check("email").isEmail().withMessage("E-mail format doesn't match!"),
    check("email").custom((value) => {
        return Developer.findOne({
            where: {
                email: value
            }
        }).then((user) => {
            if (user) {
                return Promise.reject("E-mail already registered!");
            }
        })
    }),
    check("username").isLength({
        min: 8
    }).withMessage("Username minimum length 8 characters!"),
    check("username").custom((value) => {
        return Developer.findOne({
            where: {
                username: value
            }
        }).then((user) => {
            if (user) {
                return Promise.reject("Username already registered!");
            }
        })
    }),
    check("password").isLength({
        min: 8
    }).withMessage("Password length minimum 8 characters!"),
    check("passwordConfirmation").custom((value, {
        req
    }) => {
        if (value !== req.body.password)
            return Promise.reject("Confirmation Password is not match!")
        return true;
    }),
    validationMiddleware,
    AuthController.RegisterDeveloper);

router.post('/register-customer',
    check("developerId").custom((value) => {
        return Developer.findOne({
            where: {
                id: value
            }
        }).then((user) => {
            if (!user) {
                return Promise.reject("Developer Id not found!");
            }
        })
    }),
    check("firstName").isLength({
        max: 32
    }).withMessage("First Name is required!"),
    check("lastName").isLength({
        max: 32
    }).withMessage("Last Name is required!"),
    check("email").isEmail().withMessage("E-mail format doesn't match!"),
    check("email").custom((value) => {
        return Customer.findOne({
            where: {
                email: value
            }
        }).then((user) => {
            if (user) {
                return Promise.reject("E-mail already registered!");
            }
        })
    }),
    check("phoneNumber").isNumeric().withMessage("Phone Number must be numeric!"),
    check("phoneNumber").isLength({
        min: 11,
        max: 13
    }).withMessage("Phone Number uncorrect length!"),
    check("username").isLength({
        min: 8
    }).withMessage("Username minimum length 8 characters!"),
    check("username").custom((value) => {
        return Customer.findOne({
            where: {
                username: value
            }
        }).then((user) => {
            if (user) {
                return Promise.reject("Username already registered!");
            }
        })
    }),
    check("password").isLength({
        min: 8
    }).withMessage("Password length minimum 8 characters!"),
    check("passwordConfirmation").custom((value, {
        req
    }) => {
        if (value !== req.body.password)
            return Promise.reject("Confirmation Password is not match!")
        return true;
    }),
    validationMiddleware,
    AuthController.RegisterCustomer);

router.post('/login-developer',
    check("username").custom((value) => {
        return Developer.findOne({
            where: {
                username: value
            }
        }).then((user) => {
            if (!user) {
                return Promise.reject("Username not registered!");
            }
        })
    }),
    check("password").isLength({
        min: 8
    }).withMessage("Password length minimum 8 characters!"),
    validationMiddleware,
    AuthController.LoginDeveloper);

router.post('/login-customer',
    check("username").custom((value) => {
        return Customer.findOne({
            where: {
                username: value
            }
        }).then((user) => {
            if (!user) {
                return Promise.reject("Username not registered!");
            }
        })
    }),
    check("password").isLength({
        min: 8
    }).withMessage("Password length minimum 8 characters!"),
    validationMiddleware,
    AuthController.LoginCustomer);

module.exports = router;