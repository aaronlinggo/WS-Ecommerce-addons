'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderDetail extends Model {
    static associate(models) {
      this.belongsTo(models.Order, { foreignKey: "codeOrder" });
      this.belongsTo(models.Product, { foreignKey: "codeProduct" });
    }
  }
  OrderDetail.init({
    codeOrder: DataTypes.STRING,
    codeProduct: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'OrderDetail',
    tableName: "orderdetails",
  });
  return OrderDetail;
};