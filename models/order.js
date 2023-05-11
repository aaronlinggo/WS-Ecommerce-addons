"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Customer, {
        foreignKey: "customerId"
      });
      this.hasOne(models.Payment, { foreignKey: "codePayment" });
      this.hasMany(models.OrderDetail, { foreignKey: "codeOrder" });
    }
  }
  Order.init(
    {
      codeOrder: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      customerId: DataTypes.INTEGER,
      courierJne: DataTypes.ENUM(["OKE", "REG", "SPS", "YES"]),
      address: DataTypes.STRING,
      origin: DataTypes.STRING,
      destination: DataTypes.STRING,
      weight: DataTypes.INTEGER,
      costCourier: DataTypes.INTEGER,
      subtotal: DataTypes.INTEGER,
      statusOrder: DataTypes.ENUM([
        "PENDING",
        "PROCESS",
        "DELIVERED",
        "CANCEL",
      ]),
    },
    {
      sequelize,
      modelName: "Order",
      tableName: "orders",
    }
  );
  return Order;
};
