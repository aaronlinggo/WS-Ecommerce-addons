const SubscriptionController = require('../controllers/SubscriptionController');
const express = require("express");
const {
    check
} = require("express-validator");
const Subscription = require("../models").Subscription;
const PaymentSubscription = require("../models").PaymentSubscription;
const validationMiddleware = require("../middleware/ValidationMiddleware")
const authMiddleware = require("../middleware/AuthMiddleware")
const {
    Op
} = require('sequelize');
const router = express.Router();

router.post('/buy-subscription',
    check("type").custom((value) => {
        return Subscription.findOne({
            where: {
                type: value
            }
        }).then((subs) => {
            if (!subs) {
                return Promise.reject("Type Subscriptions not found!");
            }
        })
    }),
    validationMiddleware,
    authMiddleware.developerMiddleware,
    SubscriptionController.BuySubscription);

router.post('/payment-subscription',
    check("codePayment").custom((value) => {
        return PaymentSubscription.findOne({
            where: {
                codePayment: value
            }
        }).then((ps) => {
            if (!ps) {
                return Promise.reject("Code Payment Not Found");
            } else {
                if (ps.dataValues.paymentStatus == "paid") {
                    return Promise.reject("Code Payment already paid!");
                }
            }
        })
    }),
    validationMiddleware,
    SubscriptionController.PaySubscription);

module.exports = router;