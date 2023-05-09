'use strict';

const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const items = generateFakerItems(10);
    await queryInterface.bulkInsert('products', items, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
  }
};

function generateFakerItems(rowCount) {
  const data = [];
  for (let i = 0; i < rowCount; i++) {
    const newItem = {
      codeProduct: "WSEC" + ((data.length + 1) + "").padStart(5, '0'),
      developerId: faker.helpers.arrayElement([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      name: faker.commerce.productName(),
      price: faker.commerce.price(10000, 100000, 0),
      weight: (500 * parseInt(faker.helpers.arrayElement([1, 2, 3, 4]))),
      photo: faker.image.abstract(),
      stock: faker.commerce.price(1, 100, 0),
      description: faker.commerce.productDescription(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    data.push(newItem);
  }

  return data;
}