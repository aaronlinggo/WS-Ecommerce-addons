const productController = require('../controllers/ProductController');
const express = require("express");
const authMiddleware = require("../middleware/AuthMiddleware")
const validationMiddleware = require("../middleware/ValidationMiddleware")
const subscriptionMiddleware = require("../middleware/SubscriptionMiddleware")
const Product = require('../models').Product;
const {
    check
} = require("express-validator");
const jwt = require('jsonwebtoken');
require("dotenv").config();
const fs = require('fs');
const {
    Op
} = require('sequelize');
const router = express.Router();
const multer = require("multer");
const storage = multer.diskStorage({
    destination: async function (req, file, callback) {
        var token = req.header("x-auth-token");
        userlogin = jwt.verify(token, process.env.JWT_KEY);
        const path = `./storage/${userlogin.username}`
        fs.mkdirSync(path, {
            recursive: true
        })
        callback(null, path)
    },
    filename: async function (req, file, callback) {
        if (req.params.id == null) {
            //masuk add product
            let products = await Product.findOne({
                order: [
                    ["codeProduct", "DESC"]
                ],
                limit: 1,
            });
            var temp = products.codeProduct;
            var angkaterakhir = parseInt(temp.slice(4, 9));
            var code = "WSEC" + ((angkaterakhir + 1) + "").padStart(5, '0');
            callback(null, code + '.jpg');
        } else {
            //masuk edit product
            callback(null, req.params.id + '.jpg');
        }
    }
});
var upd = multer({
    storage: storage
});

router.get('/', validationMiddleware, authMiddleware.developerMiddleware, subscriptionMiddleware, productController.getAll);

router.post('/', upd.single('photo'),
    check('photo')
    .custom((value, {
        req
    }) => {
        console.log(req.file);
        if (req.file.mimetype === 'image/jpeg') {
            return '.jpeg';
        } else if (req.file.mimetype === 'image/png') {
            return '.png';
        } else {
            return false;
        }
    })
    .withMessage('Please only submit jpg/png document!'),
    check("name").notEmpty().withMessage("Name is required!"),
    check("price").notEmpty().withMessage("Price is required!"),
    check("price").isNumeric().withMessage("Price must be numeric!"),
    check("stock").notEmpty().withMessage("Stock is required!"),
    check("stock").isNumeric().withMessage("Stock must be numeric!"),
    check("weight").notEmpty().withMessage("Weight is required!"),
    check("weight").isNumeric().withMessage("Weight must be numeric!"),
    check("description").notEmpty().withMessage("Description is required!"),
    validationMiddleware, authMiddleware.developerMiddleware, subscriptionMiddleware, productController.addProduct);

router.put('/edit/:id', upd.single('photo'),
    check('photo')
    .custom((value, {
        req
    }) => {
        console.log(req.file);
        if (req.file.mimetype === 'image/jpeg') {
            return '.jpeg';
        } else if (req.file.mimetype === 'image/png') {
            return '.png';
        } else {
            return false;
        }
    })
    .withMessage('Please only submit jpg/png document!'),
    check("name").notEmpty().withMessage("Name is required!"),
    check("price").notEmpty().withMessage("Price is required!"),
    check("price").isNumeric().withMessage("Price must be numeric!"),
    check("stock").notEmpty().withMessage("Stock is required!"),
    check("stock").isNumeric().withMessage("Stock must be numeric!"),
    check("weight").notEmpty().withMessage("Weight is required!"),
    check("weight").isNumeric().withMessage("Weight must be numeric!"),
    check("description").notEmpty().withMessage("Description is required!"),
    validationMiddleware, authMiddleware.developerMiddleware, subscriptionMiddleware, productController.editProduct);

router.delete('/delete/:id',
    check("id").notEmpty().withMessage("Product Code is required!"),
    validationMiddleware, authMiddleware.developerMiddleware, subscriptionMiddleware, productController.deleteProduct);
router.get('/detail/:id', check("id").notEmpty().withMessage("Product Code is required!"), validationMiddleware, authMiddleware.developerMiddleware, productController.getDetailProduct);

router.post('/bulkcreate', validationMiddleware, authMiddleware.developerMiddleware, subscriptionMiddleware, productController.bulkAddProduct);
module.exports = router;