const express = require('express');
const router = express.Router();

const order = require('../controllers/order_controller');

// lihat request order
router.get('/', async (req, res) => {
    let orders = await order.seeAllOrder();

    const output = {
      status: 200,
      body: {
        orders,
      },
    };

    return res.status(200).json(output);
});

module.exports = router;