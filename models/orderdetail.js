'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderDetail extends Model {
    static associate(models) {
      this.belongsTo(models.Order, { foreignKey: "codeOrder" });
      this.belongsTo(models.Product, { foreignKey: "codeProduct" });
      this.hasMany(models.Review, { foreignKey: "codeOrderDetail" });
    }
  }
  OrderDetail.init({
    codeOrderDetail : {type: DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
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