const { Review, Order, Customer, Product, OrderDetail, Developer } = require('../models');

const jwt = require('jsonwebtoken');
const { output } = require('pdfkit');
require('dotenv').config();

// NOMOR 10
const getAllReview = async (req, res) => {
	var token = req.header('x-auth-token');
	dev = jwt.verify(token, process.env.JWT_KEY);

	let { sortByRating, sortByCreatedAt } = req.query;
	var data_all_review;

	try {
		if (sortByRating) {
			data_all_review = await Review.findAll({
				include: [
					{ model: OrderDetail, include: [{ model: Order }, { model: Product }] },
					{ model: Customer, where: { developerId: dev.id } },
				],
				order: [['rating', sortByRating.toUpperCase()]],
			});
		} else if (sortByCreatedAt) {
			data_all_review = await Review.findAll({
				include: [
					{ model: OrderDetail, include: [{ model: Order }, { model: Product }] },
					{ model: Customer, where: { developerId: dev.id }},
				],
				order: [['createdAt', sortByCreatedAt.toUpperCase()]],
			});
		} else {
			data_all_review = await Review.findAll({
				include: [
					{
						model: OrderDetail,
						include: [{ model: Order }, { model: Product }],
					},
					{
						model: Customer,
						where: { developerId: dev.id },
					},
				],
				// where: { '$developerId$': 6 },
				order: [
					['rating', 'ASC'],
					['createdAt', 'ASC'],
				],
			});

			// data_all_review = await Review.findAll({
			// 	include: [
			// 		{
			// 			model: Customer,
			// 			where: { developerId: 2 }
			// 		},
			// 	],
			// 	// where: { '$developerId$': dev.id },
			// });
		}

		const output = {
			status: 200,
			body: data_all_review.map((review) => ({
				'Customer Name': review.Customer.firstName + ' ' + review.Customer.lastName,
				'Product Name': review.OrderDetail.Product.name,
				'Product Price': 'Rp ' + review.OrderDetail.Product.price + ',00',
				'Courier JNE': review.OrderDetail.Order.courierJne,
				Review: {
					'Rating Product': review.rating,
					'Comment Product': review.comment,
				},
			})),
		};

		// const output = {
		// 	status: 200,
		// 	body: data_all_review.map((review) => ({
		// 		'Customer Name': review.Customer.firstName + ' ' + review.Customer.lastName,
		// 		Review: {
		// 			'Rating Product': review.rating,
		// 			'Comment Product': review.comment,
		// 		},
		// 	})),
		// };

		return res.status(output.status).json(output);
	} catch (err) {
		return res.status(500).json(err.message);
	}
};

module.exports = {
	getAllReview,
};
