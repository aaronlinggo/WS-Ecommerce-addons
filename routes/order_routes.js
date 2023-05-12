const express = require('express');
const router = express.Router();

const order_controller = require('../controllers/order_controller');

router.get('/getAllOrder/:code_order?', order_controller.getAllOrder);
router.get('/getAllRequestOrder', order_controller.getAllRequestOrder);
router.put('/acceptOrder/:id', order_controller.acceptOrder);
router.put('/completeOrder/:id', order_controller.completeOrder);
router.put('/cancelOrder/:id', order_controller.cancelOrder);

module.exports = router;
