'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(order, customer) {
      // Review.belongsTo(order, {foreignKey: 'codeOrder'});
      // Review.belongsTo(customer, {foreignKey: 'id'});
    }
  }
  Review.init({
    codeOrder: DataTypes.STRING,
    rating: DataTypes.ENUM(['1','2','3','4','5']),
    customerId: DataTypes.INTEGER,
    comment: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};