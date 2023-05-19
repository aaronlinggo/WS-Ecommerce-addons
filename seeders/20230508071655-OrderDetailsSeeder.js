'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('orderdetails', [
      {
        codeOrder: 'OR00001',
        codeProduct: 'WSEC00001',
        quantity: 1,
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        codeOrder: 'OR00002',
        codeProduct: 'WSEC00002',
        quantity: 1,
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('orderdetails', null, {});
  }
};
