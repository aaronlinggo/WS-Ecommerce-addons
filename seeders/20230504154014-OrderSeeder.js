'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // await queryInterface.bulkInsert('orders', [
    //   {
    //     codeOrder: 'OR00001',
    //     customerId: 1,
    //     courierJne: 'REG',
    //     address: 'Jln. Ngagel ABC 123',
    //     origin: 'SUB',
    //     destination: 'JKT',
    //     weight: 1000,
    //     costCourier: 14000,
    //     subtotal: 14000,
    //     statusOrder: 'PENDING',
    //     createdAt: Date.now(),
    //     updatedAt: Date.now()
    //   },
    //   {
    //     codeOrder: 'OR00002',
    //     customerId: 2,
    //     courierJne: 'REG',
    //     address: 'Jln. Ngagel ABC 123',
    //     origin: 'SUB',
    //     destination: 'JKT',
    //     weight: 1500,
    //     costCourier: 20000,
    //     subtotal: 30000,
    //     statusOrder: 'PENDING',
    //     createdAt: Date.now(),
    //     updatedAt: Date.now()
    //   },
    // ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('orders', null, {});
  }
};
