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

    await queryInterface.bulkInsert('reviews', [
      {
        codeOrderDetail: 1,
        rating: '3',
        customerId: 1,
        comment: 'gdshfsgh'
      },
      {
        codeOrderDetail: 2,
        rating: '3',
        customerId: 2,
        comment: 'jasndjnaj'
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
