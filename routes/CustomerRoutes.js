const { response } = require("express");
const express = require("express");
const { Op } = require("sequelize");

const CCustomer = require("../controllers/CustomerController");
// const COrder = require("../controllers/OrderController");

const Order = require('../models').Order;
const Customer = require('../models').Customer;

const { check } = require("express-validator");

const router = express.Router();

// /customer
//VIEW ORDER
//params =  customerId (1-20)
//body   =  codeOrder (optional

router.get("/order/viewOrder/:customerId",
    check("customerId").custom((value) => {
        return Customer.findOne({ where: { id: value } }).then((user) => {
            if (!user) {
                return Promise.reject("Customer dengan Id tersebut tidak ditemukan");
            }
        })
    })
    , CCustomer.viewOrder);


//PAY ORDER
//params =  customerId (1-20)
//body   =  codeOrder
router.post("/order/payOrder/:customerId",
    check("customerId").custom((value) => {
        return Customer.findOne({ where: { id: value } }).then((user) => {
            if (!user) {
                return Promise.reject("Customer dengan Id tersebut tidak ditemukan");
            }
        })
    }),
    check("codeOrder").custom((value) => {
        return Order.findOne({ where: { codeOrder: value } }).then((order) => {
            if (!order) {
                return Promise.reject("Order dengan Id tersebut tidak ditemukan");
            }
        })
    })
    , CCustomer.payOrder);

//Check Out
//params =  customerId (1-20)
//body =    courierJne (OKE/REG/SPS/YES), 
//          origin (1-500), 
//          destination (1-500)

router.post("/order/checkout/:customerId",
    check("customerId").custom((value) => {
        return Customer.findOne({ where: { id: value } }).then((user) => {
            if (!user) {
                return Promise.reject("Customer dengan Id tersebut tidak ditemukan");
            }
        })
    }),
    check("courierJne").custom((value) => {
        if (value == "OKE" || value == "REG" || value == "SPS" || value == "YES") {
            return true;
        }
        else {
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
    })
    , CCustomer.checkOut);

//ADD TO CART
//params =  customerId (1-20)
//body =    quantity (1 atau 1,2,3,4,....), 
//          codeProduct (WSEC00002 / WSEC00001,WSEC00003), 
//          nameProduct (Small Fresh Car / Small Fresh Car,Electronic Steel Car)
router.post("/addToCart/:customerId",
    check("customerId").custom((value) => {
        return Customer.findOne({ where: { id: value } }).then((user) => {
            if (!user) {
                return Promise.reject("Customer dengan Id tersebut tidak ditemukan");
            }
        })
    }),
    check("quantity").notEmpty().withMessage("Quantity harus diisi (1,2,...)!"),
    check("quantity").custom((value) => {
        let panjangQty = value.split(",");
        for (let i = 0; i < panjangQty.length; i++) {
            let number = +panjangQty[i];
            if (number) {
            } else {
                return Promise.reject("Quantity hanya boleh berisi angka (1,2,...)!");
            }
            // return Promise.reject(panjangQty.length);
        }
        return true;
    })
    , CCustomer.addToCart);

module.exports = router;