'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Customer, {
        foreignKey: "customerId"
      });
      this.belongsTo(models.Product, { foreignKey: "codeProduct" });
    }
  }
  Cart.init({
    customerId: DataTypes.INTEGER,
    codeProduct: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Cart',
    tableName: 'carts',
  });
  return Cart;
};