const { Review, Order, Customer, Product, OrderDetail } = require('../models');

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
			if (
				sortByRating.toLowerCase() != 'asc' &&
				sortByRating.toLowerCase() != 'desc'
			) {
				return res.formatter.badRequest('can only be sorted by asc or desc!');
			} else {
				data_all_review = await Review.findAll({
					include: [
						{ model: OrderDetail, include: [{ model: Order }, { model: Product, where: { developerId: dev.id } }] },
						{ model: Customer },
					],
					order: [['rating', sortByRating.toUpperCase()]],
				});
			}
		} else if (sortByCreatedAt) {
			if (
				sortByCreatedAt.toLowerCase() != 'asc' &&
				sortByCreatedAt.toLowerCase() != 'desc'
			) {
				return res.formatter.badRequest('can only be sorted by asc or desc!');
			} else {
				data_all_review = await Review.findAll({
					include: [
						{ model: OrderDetail, include: [{ model: Order }, { model: Product, where: { developerId: dev.id } }] },
						{ model: Customer },
					],
					order: [['createdAt', sortByCreatedAt.toUpperCase()]],
				});
			}
		} else {
			data_all_review = await Review.findAll({
				include: [
					{
						model: OrderDetail,
						include: [{ model: Order }, { model: Product, where: { developerId: dev.id } }],
					},
					{
						model: Customer,
						// where: { developerId: dev.id }
					},
				],
				// where: { '$`Customer.developerId`$': dev.id },
				order: [
					['rating', 'ASC'],
					['createdAt', 'ASC'],
				],
			});

			// return res.status(200).send(data_all_review);
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
