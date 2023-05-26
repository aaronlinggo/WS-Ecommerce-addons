const DeveloperController = require('../controllers/DeveloperController');
const express = require("express");
const {
    Op
} = require('sequelize');
const authMiddleware = require("../middleware/AuthMiddleware")
const subscriptionMiddleware = require("../middleware/SubscriptionMiddleware")
const router = express.Router();

router.get('/', authMiddleware.developerMiddleware, subscriptionMiddleware, DeveloperController.ExportOrder);

module.exports = router;