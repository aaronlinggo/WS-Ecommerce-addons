const express = require('express');
const router = express.Router();

const order_controller = require('../controllers/order_controller');
const authMiddleware = require("../middleware/AuthMiddleware")
const subscriptionMiddleware = require("../middleware/SubscriptionMiddleware")

router.get('/seeAllRequestOrder', authMiddleware.developerMiddleware, subscriptionMiddleware, order_controller.seeAllRequestOrder);
router.put('/acceptOrder/:id', authMiddleware.developerMiddleware, subscriptionMiddleware, order_controller.acceptOrder);
router.put('/completeOrder/:id', authMiddleware.developerMiddleware, subscriptionMiddleware, order_controller.completeOrder);
router.put('/cancelOrder/:id', authMiddleware.developerMiddleware, subscriptionMiddleware, order_controller.cancelOrder);

module.exports = router;
