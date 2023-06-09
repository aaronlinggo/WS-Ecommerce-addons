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
    static associate(models) {
      this.belongsTo(models.OrderDetail, {foreignKey: 'codeOrderDetail'});
      this.belongsTo(models.Customer, {foreignKey: 'id'});
    }
  }
  Review.init({
    codeOrderDetail: {
      type: DataTypes.STRING,
      primaryKey: true,
      autoIncrement: true
    },
    rating: DataTypes.ENUM(['1','2','3','4','5']),
    customerId: DataTypes.INTEGER,
    comment: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Review',
    tableName: "reviews"
  });
  return Review;
};