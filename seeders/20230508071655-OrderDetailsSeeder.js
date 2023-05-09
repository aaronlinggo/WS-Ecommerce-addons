'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('orderdetails', [
      {
        codeOrder: 'OR00001',
        codeProduct: 'WSEC00001',
        quantity: 1
      },
      {
        codeOrder: 'OR00002',
        codeProduct: 'WSEC00002',
        quantity: 1
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('orderdetails', null, {});
  }
};
