'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(product, customer, payment, review) {
      // Order.belongsTo(product, {foreignKey: 'codeProduct'});
      // Order.belongsTo(customer, {foreignKey: 'id'});
      // Order.hasOne(payment, {as: "payment", foreignKey: 'codePayment'});
      // Order.hasOne(review, {as: "review", foreignKey: 'codeOrder'});
    }
  }
  Order.init({
    codeProduct: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    customerId:  DataTypes.INTEGER,
    courierJne: DataTypes.ENUM(['OKE','REG','SPS','YES']),
    origin: DataTypes.STRING,
    destination: DataTypes.STRING,
    weight: DataTypes.INTEGER,
    costCourier: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Order',
    tableName: "orders"
  });
  return Order;
};