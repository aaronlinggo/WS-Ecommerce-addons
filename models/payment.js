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
    static associate(models) {
      this.belongsTo(models.Order, {foreignKey: 'codeOrder'});
    }
  }
  Payment.init({
    codePayment: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    codeOrder: DataTypes.STRING,
    subtotal: DataTypes.INTEGER,
    paymentStatus: DataTypes.ENUM(['paid', 'unpaid'])
  }, {
    sequelize,
    modelName: 'Payment',
    tableName: "payments"
  });
  return Payment;
};