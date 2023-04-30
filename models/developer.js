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
    static associate(subscription, customers, products) {
      Developer.hasOne(subscription, {as: "subscription", foreignKey: 'developerId'});
      Developer.hasMany(customers, {as: "customers", foreignKey: 'developerId'});
      Developer.hasMany(products, {as: "products", foreignKey: 'developerId'});
    }
  }
  Developer.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    username: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Developer',
  });
  return Developer;
};