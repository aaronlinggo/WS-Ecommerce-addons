'use strict';

const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const items = generateFakerItems(10);
    await queryInterface.bulkInsert('developers', items, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('developers', null, {});
  }
};

function generateFakerItems(rowCount) {
  const data = [];
  for (let i = 0; i < rowCount; i++) {
    const newItem = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.helpers.unique(faker.internet.email),
      password: bcrypt.hashSync("12345678", 12),
      username: faker.helpers.unique(faker.name.firstName),
      createdAt: new Date(),
      updatedAt: new Date(),
      subscriptionId: 1,
      expiredSubscription: null,
    };
    data.push(newItem);
  }

  return data;
}