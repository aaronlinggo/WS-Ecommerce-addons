const productController = require('../controllers/ProductController');
const express = require("express");
const authMiddleware = require("../middleware/AuthMiddleware")
const validationMiddleware = require("../middleware/ValidationMiddleware")
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
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});
var upd = multer({
    storage: storage
});

router.get('/:nama?',
    check("nama").optional({
        nullable: true
    }).custom((value) => {
        return Product.findOne({
            where: {
                name: value
            }
        }).then((ps) => {
            if (!ps) {
                return Promise.reject("Product Not Found");
            }
        })
    }), validationMiddleware, authMiddleware.developerMiddleware, productController.getAll);

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
    check("description").notEmpty().withMessage("Description is required!"),
    validationMiddleware, authMiddleware.developerMiddleware, productController.addProduct);

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
    check("description").notEmpty().withMessage("Description is required!"),
    validationMiddleware, authMiddleware.developerMiddleware, productController.editProduct);

router.delete('/delete/:id',
    check("id").notEmpty().withMessage("Product Code is required!"),
    validationMiddleware, authMiddleware.developerMiddleware, productController.deleteProduct);
router.get('/detail/:id', check("id").notEmpty().withMessage("Product Code is required!"), validationMiddleware, authMiddleware.developerMiddleware, productController.getDetailProduct);

module.exports = router;