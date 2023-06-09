'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('paymentsubscriptions', {
      codePayment: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      developerId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'developers',
          key: 'id'
        },
      },
      subscriptionId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'subscriptions',
          key: 'id'
        },
      },
      subtotal: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      paymentStatus: {
        allowNull: false,
        type: Sequelize.ENUM(['paid', 'unpaid'])
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
    await queryInterface.dropTable('paymentsubscriptions');
  }
};