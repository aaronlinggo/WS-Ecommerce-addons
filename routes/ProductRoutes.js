const productController = require('../controllers/ProductController');
const express = require("express");
const {
    Op
} = require('sequelize');
const router = express.Router();
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './assets')
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});
var upd = multer({
    storage: storage
});

router.get('/', productController.getAll);
router.post('/', upd.single('photo'), productController.addProduct);

module.exports = router;