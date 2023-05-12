const {
    response
} = require("express");
const express = require("express");
const {
    Op
} = require("sequelize");

const CCustomer = require("../controllers/CustomerController");
// const COrder = require("../controllers/OrderController");

const Order = require('../models').Order;
const Customer = require('../models').Customer;
const OrderDetail = require('../models').OrderDetail;

const {
    check
} = require("express-validator");
const authMiddleware = require("../middleware/AuthMiddleware")

const router = express.Router();

// /customer
//VIEW ORDER
//params =  customerId (1-20)
//body   =  codeOrder (optional

router.get("/viewOrder/:customerId",
    check("customerId").custom((value) => {
        return Customer.findOne({ where: { id: value } }).then((user) => {
            if (!user) {
                return Promise.reject("Customer dengan Id tersebut tidak ditemukan");
            }
        })
    }),
    check("codeOrder").optional().custom((value) => {
        return Order.findOne({ where: { codeOrder: value } }).then((order) => {
            if (!order) {
                return Promise.reject("Orderan dengan kode tersebut tidak ditemukan");
            }
        })
    }),
    check("statusOrder").optional().custom((value) => {
        if (value!="PENDING" && value!="PROCESS" && value!="DELIVERED" && value!="CANCEL") {
            return Promise.reject("Status order hanya boleh diisi dengan (PENDING,PROCESS,DELIVERED,CANCEL)");
        }
        return true;
    }),
    CCustomer.viewOrder);


//PAY ORDER
//params =  customerId (1-20)
//body   =  codeOrder
router.post("/pay/:customerId",
    check("customerId").custom((value) => {
        return Customer.findOne({ where: { id: value } }).then((user) => {
            if (!user) {
                return Promise.reject("Customer dengan Id tersebut tidak ditemukan");
            }
        })
    }),
    check("codeOrder").not().isEmpty().withMessage("codeOrder harus diisi!"),
    check("codeOrder").custom((value) => {
        return Order.findOne({ where: { codeOrder: value } }).then((order) => {
            if (!order) {
                return Promise.reject("Order dengan kode tersebut tidak ditemukan");
            }
        })
    })
    , CCustomer.payOrder);

//Check Out
//params =  customerId (1-20)
//body =    courierJne (OKE/REG/SPS/YES), 
//          origin (1-500), 
//          destination (1-500)

router.post("/checkout/:customerId",
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
    }),
    check("address").not().isEmpty().withMessage("address Harus diisi!")
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

//ADD REVIEW
//params =  customerId (1-20)
//body =    rating (1 - 5), 
//          comment (isi review), 
//          codeOrderDetail (PK Order Detail)
router.post("/review/:customerId",
    check("customerId").custom((value) => {
        return Customer.findOne({ where: { id: value } }).then((user) => {
            if (!user) {
                return Promise.reject("Customer dengan Id tersebut tidak ditemukan");
            }
        })
    }),
    check("rating").isInt({ min: 1, max: 5 }).withMessage("Rating harus berupa angka dari 1-5!"),
    check("comment").notEmpty().withMessage("Comment haruss diisi!"),
    check("codeOrderDetail").custom((value) => {
        return OrderDetail.findOne({ where: { codeOrderDetail: value } }).then((orderDetail) => {
            if (!orderDetail) {
                return Promise.reject("Order detail dengan code tersebut tidak ditemukan");
            }
        })
    })
    , CCustomer.addReview);

module.exports = router;