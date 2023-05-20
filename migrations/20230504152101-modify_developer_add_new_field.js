'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Developers', 'subscriptionId', { 
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: 'Subscriptions',
        key: 'id'
      },
    });
    await queryInterface.addColumn('Developers', 'expiredSubscription', { 
      allowNull: true,
      type: Sequelize.DATE,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Developers', 'subscriptionId');
    await queryInterface.removeColumn('Developers', 'expiredSubscription');
  }
};
