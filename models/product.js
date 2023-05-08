'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Developer, {foreignKey: 'developerId'});
      this.hasMany(models.OrderDetail, {foreignKey: 'codeProduct'});
    }
  }
  Product.init({
    codeProduct: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    developerId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    weight: DataTypes.INTEGER,
    photo: DataTypes.STRING,
    stock: DataTypes.INTEGER,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    paranoid:true
  });
  return Product;
};