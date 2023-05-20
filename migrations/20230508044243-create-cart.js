'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('carts', {
      customerId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'customers',
          key: 'id'
        },
      },
      codeProduct: {
        allowNull: false,
        type: Sequelize.STRING,
        references: {
          model: 'products',
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
    await queryInterface.dropTable('carts');
  }
};