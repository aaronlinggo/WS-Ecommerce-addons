const express = require('express');
const router = express.Router();

const order_controller = require('../controllers/order_controller');

router.get('/', order_controller.getAllOrder);

module.exports = router;