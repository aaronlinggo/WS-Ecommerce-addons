const productController = require('../controllers/ProductController');
const express = require("express");
const Product = require('../models').Product;
const authMiddleware = require("../middleware/AuthMiddleware")
const {
    Op
} = require('sequelize');
const router = express.Router();
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './assets/')
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});
var upd = multer({
    storage: storage
});

router.get('/', authMiddleware.developerMiddleware, productController.getAll);
router.post('/', upd.single('photo'), authMiddleware.developerMiddleware,productController.addProduct);
router.put('/edit/:id', upd.single('photo'), authMiddleware.developerMiddleware, productController.editProduct);
router.delete('/delete/:id', authMiddleware.developerMiddleware, productController.deleteProduct);
router.get('/detail/:id', authMiddleware.developerMiddleware, productController.getDetailProduct);

module.exports = router;