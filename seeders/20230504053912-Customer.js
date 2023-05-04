'use strict';

const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const items = generateFakerItems(20);
    await queryInterface.bulkInsert('customers', items, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('customers', null, {});
  }
};

function generateFakerItems(rowCount) {
  const data = [];
  for (let i = 0; i < rowCount; i++) {
    const newItem = {
      developerId: faker.random.numeric(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.helpers.unique(faker.internet.email),
      phoneNumber: faker.phone.number('08##########'),
      username: faker.helpers.unique(faker.name.firstName),
      password: bcrypt.hashSync("12345678", 12),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    data.push(newItem);
  }

  return data;
}
