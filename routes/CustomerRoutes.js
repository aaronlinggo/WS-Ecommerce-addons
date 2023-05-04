const { response } = require("express");
const express = require("express");
const { Op } = require("sequelize");

const CCustomer = require("../controllers/CustomerController");
const COrder = require("../controllers/OrderController");

const Order = require('../models').Order;
const Customer = require('../models').Customer;

const { check } = require("express-validator");

const router = express.Router();

// /customer
router.get("/order/viewOrder/:customerId",
check("customerId").custom((value) => {
    return Customer.findOne({ where: { id: value } }).then((user) => {
        if (!user) {
            return Promise.reject("Customer dengan Id tersebut tidak ditemukan");
        }
    })
})
,COrder.viewOrder);

router.get("/order/payOrder/:customerId",
check("customerId").custom((value) => {
    return Customer.findOne({ where: { id: value } }).then((user) => {
        if (!user) {
            return Promise.reject("Customer dengan Id tersebut tidak ditemukan");
        }
    })
}),
check("codeOrder").custom((value) => {
    return Customer.findOne({ where: { id: value } }).then((user) => {
        if (!user) {
            return Promise.reject("Customer dengan Id tersebut tidak ditemukan");
        }
    })
})
,COrder.viewOrder);


module.exports = router;