const DeveloperController = require('../controllers/DeveloperController');
const express = require("express");
const {
    Op
} = require('sequelize');
const authMiddleware = require("../middleware/AuthMiddleware")
const router = express.Router();

router.get('/', authMiddleware.developerMiddleware, DeveloperController.ExportOrder);

module.exports = router;