'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('Reviews', 'codeOrderDetail', {
			allowNull: false,
			type: Sequelize.INTEGER,
			references: {
				model: 'OrderDetails',
				key: 'codeOrderDetail',
			},
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn('Reviews', 'codeOrderDetail');
	},
};
