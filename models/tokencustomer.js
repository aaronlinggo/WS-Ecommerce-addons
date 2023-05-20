'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TokenCustomer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TokenCustomer.init({
    customerId: DataTypes.INTEGER,
    token: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    expiredAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'TokenCustomer',
    tableName: 'TokenCustomers'
  });
  TokenCustomer.removeAttribute('id');
  return TokenCustomer;
};