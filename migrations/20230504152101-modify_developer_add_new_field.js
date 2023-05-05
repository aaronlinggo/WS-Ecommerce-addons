'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('developers', 'subscriptionId', { 
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: 'subscriptions',
        key: 'id'
      },
    });
    await queryInterface.addColumn('developers', 'expiredSubscription', { 
      allowNull: true,
      type: Sequelize.DATE,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('developers', 'subscriptionId');
    await queryInterface.removeColumn('developers', 'expiredSubscription');
  }
};
