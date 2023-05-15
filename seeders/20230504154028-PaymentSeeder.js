'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // await queryInterface.bulkInsert('Payments', [
    //   {
    //     codePayment: 'INVOICEORDER00001',
    //     codeOrder: 'OR00001',
    //     subtotal: 14000,
    //     paymentStatus: 'unpaid',
    //     createdAt: Date.now(),
    //     updatedAt: Date.now()
    //   },
    //   {
    //     codePayment: 'INVOICEORDER00002',
    //     codeOrder: 'OR00002',
    //     subtotal: 30000,
    //     paymentStatus: 'paid',
    //     createdAt: Date.now(),
    //     updatedAt: Date.now()
    //   }
    // ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Payments', null, {});
  }
};
