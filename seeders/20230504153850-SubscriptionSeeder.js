'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('subscriptions', [{
      type: 'BASIC',
      price: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      type: 'PREMIUM',
      price: 500000,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('subscriptions', null, {});
  }
};
