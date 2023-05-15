'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Developer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Product, {
        foreignKey: 'developerId'
      });
      this.hasMany(models.Customer, {
        foreignKey: 'developerId'
      });
      this.belongsTo(models.Subscription, {
        foreignKey: 'subscriptionId'
      });
      this.hasMany(models.PaymentSubscription, {
        foreignKey: 'developerId'
      });
      this.hasOne(models.TokenDeveloper, {
        foreignKey: 'developerId'
      });
    }
  }
  Developer.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    shop: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    username: DataTypes.STRING,
    subscriptionId: DataTypes.INTEGER,
    expiredSubscription: DataTypes.DATE,
    email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Developer',
    tableName: 'developers'
  });
  return Developer;
};