const Order = require("../models/order");

async function getAll(req, res) {
    let result = await Customer.findAll();
    return res.status(200).send({result : result});
}

module.exports = {
    getAll
}