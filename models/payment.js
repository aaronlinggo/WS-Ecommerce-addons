'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(order) {
      // Payment.belongsTo(order, {foreignKey: 'codeOrder'});
    }
  }
  Payment.init({
    codeOrder: DataTypes.STRING,
    subtotal: DataTypes.INTEGER,
    paymentStatus: DataTypes.ENUM(['paid', 'unpaid'])
  }, {
    sequelize,
    modelName: 'Payment',
  });
  return Payment;
};