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
    static associate(models) {
      this.belongsTo(models.Product, {foreignKey: 'codeProduct'});
      this.belongsTo(models.Customer, {foreignKey: 'id'});
      this.hasOne(models.Payment, {foreignKey: 'codePayment'});
      this.hasOne(models.Review, {foreignKey: 'codeOrder'});
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
    statusOrder: DataTypes.ENUM(['PENDING', 'PROCESS', 'DELIVERED', 'CANCEL'])
  }, {
    sequelize,
    modelName: 'Order',
    tableName: "orders"
  });
  return Order;
};