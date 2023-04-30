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
    static associate(developer, orders, reviews) {
      Customer.belongsTo(developer , {foreignKey: 'id'});
      Customer.hasMany(orders, {as: "orders", foreignKey: 'customerId'});
      Customer.hasMany(reviews, {as: "reviews", foreignKey: 'customerId'});
    }
  }
  Customer.init({
    developerId: DataTypes.INTEGER,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Customer',
  });
  return Customer;
};