const express = require('express');
const router = express.Router();

const order_controller = require('../controllers/order_controller');
const authMiddleware = require("../middleware/AuthMiddleware")

router.get('/getAllOrder/:code_order?', authMiddleware.developerMiddleware, subscriptionMiddleware, order_controller.getAllOrder);
router.get('/getAllRequestOrder', authMiddleware.developerMiddleware, subscriptionMiddleware, order_controller.getAllRequestOrder);
router.put('/acceptOrder/:id', authMiddleware.developerMiddleware, subscriptionMiddleware, order_controller.acceptOrder);
router.put('/completeOrder/:id', authMiddleware.developerMiddleware, subscriptionMiddleware, order_controller.completeOrder);
router.put('/cancelOrder/:id', authMiddleware.developerMiddleware, subscriptionMiddleware, order_controller.cancelOrder);

module.exports = router;
