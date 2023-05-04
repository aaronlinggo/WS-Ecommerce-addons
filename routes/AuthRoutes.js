const AuthController = require('../controllers/AuthController');
const express = require("express");
const {
    Op
} = require('sequelize');
const router = express.Router();

router.post('/register-developer', AuthController.RegisterDeveloper)
module.exports = router;