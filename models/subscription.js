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
      this.belongsTo(models.Developer, {foreignKey: 'id'});
    }
  }
  Subscription.init({
    developerId: DataTypes.INTEGER,
    expired: DataTypes.DATE,
    paymentStatus: DataTypes.ENUM(['paid', 'unpaid'])
  }, {
    sequelize,
    modelName: 'Subscription',
    tableName: "subscriptions"
  });
  return Subscription;
};