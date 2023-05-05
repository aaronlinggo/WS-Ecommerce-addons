'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Subscription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Developer, {foreignKey: 'subscriptionId'});
      this.hasMany(models.PaymentSubscription, {foreignKey: 'subscriptionId'});
    }
  }
  Subscription.init({
    type: DataTypes.STRING,
    price: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Subscription',
    tableName: "subscriptions"
  });
  return Subscription;
};