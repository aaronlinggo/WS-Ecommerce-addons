'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TokenDeveloper extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TokenDeveloper.init({
    developerId: DataTypes.INTEGER,
    token: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    expiredAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'TokenDeveloper',
    tableName: 'tokendevelopers'
  });
  return TokenDeveloper;
};