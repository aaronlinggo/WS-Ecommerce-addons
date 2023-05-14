const { exportInvoice } = require("../controllers/InvoiceController");
const authMiddleware = require("../middleware/AuthMiddleware")
const validationMiddleware = require("../middleware/ValidationMiddleware")
const Order = require("../models").Order;
const {
    check
} = require("express-validator");
const express = require("express");
const {
    Op
} = require('sequelize');
const router = express.Router();

router.get('/download/:codeOrder',
check("codeOrder").custom((value) => {
    return Order.findOne({ where: { codeOrder: value } }).then((user) => {
        if (!user) {
            return Promise.reject("codeOrder Not Found!");
        }
    })
}), authMiddleware.customerMiddleware, validationMiddleware, exportInvoice);

module.exports = router;