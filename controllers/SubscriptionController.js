const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
require("dotenv").config();

const Developer = require('../models').Developer;
const PaymentSubscription = require('../models').PaymentSubscription;
const Subscription = require('../models').Subscription;
const {
    Op
} = require('sequelize');


const BuySubscription = async (req, res) => {
    var token = req.header("x-auth-token");
    let dev = jwt.verify(token, process.env.JWT_KEY);
    const {
        type
    } = req.body;

    let subscription = await Subscription.findOne({
        attributes: ["id", "type", "price"],
        where: {
            type: type
        },
    });

    if (dev.subscriptionId == 1) {
        if (subscription.dataValues.type != "BASIC") {
            let payment = await PaymentSubscription.findOne({
                attributes: ["codePayment", "subtotal", "paymentStatus"],
                where: {
                    developerId: dev.id,
                    paymentStatus: "unpaid"
                },
            });
            if (!payment) {
                let allPayment = await PaymentSubscription.findAll({
                    attributes: ["codePayment"],
                });
                let codePayment = "INVOICEORDERPS" + ((allPayment.length + 1) + "").padStart(5, '0');
                let buyPayment = await PaymentSubscription.create({
                    codePayment: codePayment,
                    developerId: dev.id,
                    subscriptionId: subscription.dataValues.id,
                    subtotal: subscription.dataValues.price,
                    paymentStatus: "unpaid"
                });

                let response = {
                    codePayment: codePayment,
                    developerId: dev.id,
                    type_subscription: subscription.dataValues.type,
                    subtotal: subscription.dataValues.price,
                    paymentStatus: "unpaid"
                };

                return res.formatter.created(response);
            } else {
                // "Please payment your last subscribe"
                return res.formatter.ok(payment);
            }
        } else {
            return res.formatter.badRequest({
                message: "Buy Subscription only for PREMIUM!"
            });
        }
    } else {
        return res.formatter.ok(null, "Developer already subscribe PREMIUM");
    }
};

const PaySubscription = async (req, res) => {
    const {
        codePayment,
        subtotal
    } = req.body;

    let payment = await PaymentSubscription.findOne({
        attributes: ["codePayment", "developerId", "subscriptionId", "subtotal", "paymentStatus"],
        include: [{
            model: Subscription,
            attributes: [
                "type"
            ]
        }],
        where: {
            codePayment: codePayment
        },
    });

    if (payment) {
        if (subtotal == payment.subtotal) {
            await PaymentSubscription.update({
                paymentStatus: "paid"
            }, {
                where: {
                    codePayment: codePayment
                }
            });
            var date = new Date();
            var next_month = new Date(date.getMonth() + 1);
            await Developer.update({
                subscriptionId: payment.dataValues.subscriptionId,
                expiredSubscription: next_month
            }, {
                where: {
                    id: payment.dataValues.developerId
                }
            });

            return res.formatter.ok({
                type_subscription: payment.Subscription.dataValues.type,
                expiredSubscription: next_month
            }, `${codePayment} successfully paid`);
        } else {
            return res.formatter.badRequest({
                message: "Subtotal not match!"
            });
        }
    } else {
        return res.formatter.notFound({
            message: "Code Payment Not Found"
        })
    }
};

module.exports = {
    BuySubscription,
    PaySubscription
};