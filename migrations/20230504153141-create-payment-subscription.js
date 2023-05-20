'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PaymentSubscriptions', {
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
          model: 'Developers',
          key: 'id'
        },
      },
      subscriptionId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Subscriptions',
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
    await queryInterface.dropTable('PaymentSubscriptions');
  }
};