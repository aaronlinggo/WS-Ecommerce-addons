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
      this.belongsTo(models.Developer, {
        foreignKey: 'developerId'
      });
    }
  }
  TokenDeveloper.init({
    developerId: DataTypes.INTEGER,
    token: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    expiredAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'TokenDeveloper',
    tableName: 'tokendevelopers'
  });
  TokenDeveloper.removeAttribute('id');
  return TokenDeveloper;
};