const db = require('../models');

module.exports = {
  seeAllOrder: () => {
    try {
      const order = db["Order"].findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
    } catch (err) {
      throw err;
    }
  },

  acceptOrder: () => {
    try {
    } catch (err) {
      throw err;
    }
  },

  completeOrder: () => {
    try {
    } catch (err) {
      throw err;
    }
  },

  cancelOrder: () => {
    try {
    } catch (err) {
      throw err;
    }
  },
};
