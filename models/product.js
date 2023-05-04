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
      this.belongsTo(models.Developer, {as: "developers", foreignKey: 'id'});
      // Product.hasMany(orders, {as: "orders", foreignKey: 'codeProduct'});
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
    photo: DataTypes.STRING,
    stock: DataTypes.INTEGER,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'products'
  });
  return Product;
};