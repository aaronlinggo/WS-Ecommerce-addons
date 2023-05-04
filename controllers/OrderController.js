const Order = require("../models/order");

async function getAll(req, res) {
    let result = await Order.findAll();
    return res.status(200).send({result : result});
}

module.exports = {
    getAll
}