'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Developer, {foreignKey: 'developerId'});
      this.hasMany(models.Order, {foreignKey: 'customerId'});
      this.hasMany(models.Review, {foreignKey: 'customerId'});
      this.hasMany(models.Cart, {foreignKey : 'customerId'});
    }
  }
  Customer.init({
    developerId: DataTypes.INTEGER,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Customer',
  });
  return Customer;
};