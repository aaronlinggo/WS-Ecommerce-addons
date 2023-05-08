'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await queryInterface.bulkInsert('Orders', [
      {
        codeOrder: 'OR001',
        codeProduct: 'WSEC00001',
        quantity: 1,
        customerId: 1,
        courierJne: 'REG',
        origin: 'SUB',
        destination: 'JKT',
        weight: 1,
        costCourier: 14000,
        statusOrder: 'PENDING',
      },
      {
        codeOrder: 'OR002',
        codeProduct: 'WSEC00002',
        quantity: 1,
        customerId: 2,
        courierJne: 'REG',
        origin: 'SUB',
        destination: 'JKT',
        weight: 1,
        costCourier: 14000,
        statusOrder: 'PENDING',
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
