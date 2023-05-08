'use strict';

const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const items = generateFakerItems(10);
    await queryInterface.bulkInsert('carts', items, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('carts', null, {});
  }
};

function generateFakerItems(rowCount) {
  const data = [];
  for (let i = 0; i < rowCount; i++) {
    const newItem = {
      customerId: "18",
      codeProduct: "WSEC00001",
      quantity: faker.helpers.arrayElement([1, 2, 3, 4, 5]),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    data.push(newItem);
  }

  return data;
}