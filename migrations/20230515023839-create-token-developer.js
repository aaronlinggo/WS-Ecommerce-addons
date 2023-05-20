'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tokendevelopers', {
      developerId: {
        type: Sequelize.INTEGER
      },
      token: {
        type: Sequelize.STRING
      },
      createdAt: {
        type: Sequelize.DATE
      },
      expiredAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tokendevelopers');
  }
};