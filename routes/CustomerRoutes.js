const {
    response
} = require("express");
const express = require("express");
const {
    Op
} = require("sequelize");

const CCustomer = require("../controllers/CustomerController");
const COrder = require("../controllers/OrderController");

const Order = require('../models').Order;
const Customer = require('../models').Customer;

const {
    check
} = require("express-validator");
const authMiddleware = require("../middleware/AuthMiddleware")

const router = express.Router();

// /customer
//GET
router.get("/order/viewOrder/:customerId",
    check("customerId").custom((value) => {
        return Customer.findOne({
            where: {
                id: value
            }
        }).then((user) => {
            if (!user) {
                return Promise.reject("Customer dengan Id tersebut tidak ditemukan");
            }
        })
    }), COrder.viewOrder);

router.post("/order/payOrder/:customerId",
    check("customerId").custom((value) => {
        return Customer.findOne({
            where: {
                id: value
            }
        }).then((user) => {
            if (!user) {
                return Promise.reject("Customer dengan Id tersebut tidak ditemukan");
            }
        })
    }),
    check("codeOrder").custom((value) => {
        return Order.findOne({
            where: {
                codeOrder: value
            }
        }).then((order) => {
            if (!order) {
                return Promise.reject("Order dengan Id tersebut tidak ditemukan");
            }
        })
    }), COrder.payOrder);


router.post("/order/checkout/:customerId",
    check("customerId").custom((value) => {
        return Customer.findOne({
            where: {
                id: value
            }
        }).then((user) => {
            if (!user) {
                return Promise.reject("Customer dengan Id tersebut tidak ditemukan");
            }
        })
    }),
    check("courierJne").custom((value) => {
        if (value == "OKE" || value == "REG" || value == "SPS" || value == "YES") {
            return true;
        } else {
            return Promise.reject("Layanan yang tersedia hanya OKE,REG,SPS,YES");
        }
    }),
    check("origin").custom((value) => {
        if (value < 1 || value > 500) {
            return Promise.reject("Kode kota asal hanya boleh dari 1-500");
        }
        return true;
    }),
    check("destination").custom((value) => {
        if (value < 1 || value > 500) {
            return Promise.reject("Kode kota tujuan hanya boleh dari 1-500");
        }
        return true;
    }), COrder.checkOut);

router.post("/addToCart/:customerId",
    check("customerId").custom((value) => {
        return Customer.findOne({
            where: {
                id: value
            }
        }).then((user) => {
            if (!user) {
                return Promise.reject("Customer dengan Id tersebut tidak ditemukan");
            }
        })
    }), COrder.addToCart);

router.get("/customers", authMiddleware.developerMiddleware, CCustomer.getAll);

module.exports = router;