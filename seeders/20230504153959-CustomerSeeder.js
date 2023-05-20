'use strict';

const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const items = generateFakerItems(20);
    await queryInterface.bulkInsert('Customers', items, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Customers', null, {});
  }
};

function generateFakerItems(rowCount) {
  const data = [];
  for (let i = 0; i < rowCount; i++) {
    let firstName = faker.name.firstName();
    let lastName = faker.name.lastName();
    const newItem = {
      developerId: faker.helpers.arrayElement([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      firstName: firstName,
      lastName: lastName,
      email: faker.helpers.unique(faker.internet.email),
      phoneNumber: faker.phone.number('08##########'),
      username: (firstName+lastName).toLowerCase(),
      password: bcrypt.hashSync("12345678", 12),
      createdAt: new Date(),
      updatedAt: new Date(),
      email_verified: 1
    };
    data.push(newItem);
  }

  return data;
}
