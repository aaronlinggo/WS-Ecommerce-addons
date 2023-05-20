'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OrderDetails', {
      codeOrderDetail: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      codeOrder: {
        allowNull: false,
        type: Sequelize.STRING,
        references: {
          model: 'Orders',
          key: 'codeOrder'
        },
      },
      codeProduct: {
        allowNull: false,
        type: Sequelize.STRING,
        references: {
          model: 'Products',
          key: 'codeProduct'
        },
      },
      quantity: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('OrderDetails');
  }
};