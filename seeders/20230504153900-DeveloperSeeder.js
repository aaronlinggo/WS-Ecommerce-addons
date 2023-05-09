'use strict';

const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // await queryInterface.bulkInsert('developers', [
      
    // ]);
    const items = generateFakerItems(10);
    await queryInterface.bulkInsert('developers', items, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('developers', null, {});
  }
};

function generateFakerItems(rowCount) {
  const data = [
    {
      firstName: "Aaron",
      lastName: "Linggo Satria",
      email: "aaronlinggosatria@gmail.com",
      password: bcrypt.hashSync("12345678", 12),
      username: "aaronlinggo",
      createdAt: new Date(),
      updatedAt: new Date(),
      subscriptionId: 1,
      expiredSubscription: null,
    },
    {
      firstName: "Cyrelle",
      lastName: "Wynette",
      email: "wcyrelle8@gmail.com",
      password: bcrypt.hashSync("12345678", 12),
      username: "cyrellew",
      createdAt: new Date(),
      updatedAt: new Date(),
      subscriptionId: 1,
      expiredSubscription: null,
    },
    {
      firstName: "Felicia",
      lastName: "Putri",
      email: "felput@gmail.com",
      password: bcrypt.hashSync("12345678", 12),
      username: "felput",
      createdAt: new Date(),
      updatedAt: new Date(),
      subscriptionId: 1,
      expiredSubscription: null,
    },
    {
      firstName: "Vincent",
      lastName: "Vincent",
      email: "alaskar@gmail.com",
      password: bcrypt.hashSync("12345678", 12),
      username: "alaskar",
      createdAt: new Date(),
      updatedAt: new Date(),
      subscriptionId: 1,
      expiredSubscription: null,
    },
  ];
  for (let i = 0; i < rowCount; i++) {
    let firstName = faker.name.firstName();
    let lastName = faker.name.lastName();
    const newItem = {
      firstName: firstName,
      lastName: lastName,
      email: faker.helpers.unique(faker.internet.email),
      password: bcrypt.hashSync("12345678", 12),
      username: (firstName+lastName).toLowerCase(),
      createdAt: new Date(),
      updatedAt: new Date(),
      subscriptionId: 1,
      expiredSubscription: null,
    };
    data.push(newItem);
  }

  return data;
}