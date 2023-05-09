'use strict';

const { faker } = require('@faker-js/faker');
const fs = require('fs');
const path = require('path');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const items = generateFakerItems(500);
    await queryInterface.bulkInsert('products', items, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
  }
};

function generateFakerItems(rowCount) {
  const data = [];
  fs.readdir("./storage/aaronlinggo", (err, files) => {
    if (err) throw err;
  
    for (const file of files) {
      fs.unlink(path.join("./storage/aaronlinggo", file), (err) => {
        if (err) throw err;
      });
    }
  });
  fs.readdir("./storage/cyrellew", (err, files) => {
    if (err) throw err;
  
    for (const file of files) {
      fs.unlink(path.join("./storage/cyrellew", file), (err) => {
        if (err) throw err;
      });
    }
  });
  fs.readdir("./storage/alaskar", (err, files) => {
    if (err) throw err;
  
    for (const file of files) {
      fs.unlink(path.join("./storage/alaskar", file), (err) => {
        if (err) throw err;
      });
    }
  });
  fs.readdir("./storage/felput", (err, files) => {
    if (err) throw err;
  
    for (const file of files) {
      fs.unlink(path.join("./storage/felput", file), (err) => {
        if (err) throw err;
      });
    }
  });
  for (let i = 0; i < rowCount; i++) {
    const USERNAME = [
      "aaronlinggo",
      "cyrellew",
      "felput",
      "alaskar"
    ]
    let developerId = faker.helpers.arrayElement([1, 2, 3, 4]);

    let randomNumberPhoto = faker.helpers.arrayElement([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
    let codeProduct = "WSEC" + ((data.length + 1) + "").padStart(5, '0');
    fs.copyFile(`./storage/productDummy/${(randomNumberPhoto + "").padStart(3, '0')}_smc_ecom.jpg`, `./storage/${USERNAME[developerId-1]}/${codeProduct}.jpg`, (err) => {
      if (err) throw err;
    });
    const newItem = {
      codeProduct: codeProduct,
      developerId: developerId,
      name: faker.commerce.productName(),
      price: (10000 * parseInt(faker.helpers.arrayElement([5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 30, 25, 35, 40, 45, 50]))),
      weight: (500 * parseInt(faker.helpers.arrayElement([1, 2, 3, 4]))),
      photo: `./storage/${USERNAME[developerId-1]}/${codeProduct}.jpg`,
      stock: faker.commerce.price(1, 100, 0),
      description: faker.commerce.productDescription(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    data.push(newItem);
  }

  return data;
}