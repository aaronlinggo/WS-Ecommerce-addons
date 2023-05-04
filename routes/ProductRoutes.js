const productController = require('../controllers/ProductController');
const express = require("express");
const {
    Op
} = require('sequelize');
const router = express.Router();
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './assets/')
    }
})

router.get('/', productController.getAll);
router.post('/', productController.addProduct);

module.exports = router;