'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Orders', [
      {
        codeOrder: 'OR00001',
        customerId: 1,
        courierJne: 'REG',
        origin: 'SUB',
        destination: 'JKT',
        weight: 1,
        costCourier: 14000,
        subtotal: 28000,
        statusOrder: 'PENDING',
      },
      {
        codeOrder: 'OR00002',
        customerId: 2,
        courierJne: 'REG',
        origin: 'SUB',
        destination: 'JKT',
        weight: 1,
        costCourier: 14000,
        subtotal: 28000,
        statusOrder: 'PENDING',
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Orders', null, {});
  }
};
