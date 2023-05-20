'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PaymentSubscription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Developer, {foreignKey: 'developerId'});
      this.belongsTo(models.Subscription, {foreignKey: 'subscriptionId'});
    }
  }
  PaymentSubscription.init({
    codePayment: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    developerId: DataTypes.INTEGER,
    subscriptionId: DataTypes.INTEGER,
    subtotal: DataTypes.INTEGER,
    paymentStatus: DataTypes.ENUM(['paid', 'unpaid'])
  }, {
    sequelize,
    modelName: 'PaymentSubscription',
    tableName: "PaymentSubscriptions",
  });
  return PaymentSubscription;
};