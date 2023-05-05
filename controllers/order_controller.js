const { sequelize } = require('../models');

const Order = require('../models').Order;

const getAllOrder = async (req, res) => {
  let orders = await Order.findAll();

  return res.status(200).send(orders);
}

module.exports = {
  getAllOrder
};