const express = require('express');
const router = express.Router();

const order_controller = require('../controllers/order_controller');

router.get('/seeAllRequestOrder', order_controller.seeAllRequestOrder);
router.put('/acceptOrder/:id', order_controller.acceptOrder);
router.put('/completeOrder/:id', order_controller.completeOrder);
router.put('/cancelOrder/:id', order_controller.cancelOrder);

module.exports = router;
