const {
	Review,
	Order,
	Customer,
	Product,
	OrderDetail
} = require('../models');

// NOMOR 10
const getAllReview = async (req, res) => {
	let { sortByRating, sortByCreatedAt } = req.query;
	var data_all_review;

	try {
		if (sortByRating) {
			data_all_review = await Review.findAll({
				include: [
					{ model: OrderDetail, include: [{ model: Order }, { model: Product }] },
					{ model: Customer },
				],
				order: [['rating', sortByRating.toUpperCase()]],
			});
		} else if (sortByCreatedAt) {
			data_all_review = await Review.findAll({
				include: [
					{ model: OrderDetail, include: [{ model: Order }, { model: Product }] },
					{ model: Customer },
				],
				order: [['createdAt', sortByCreatedAt.toUpperCase()]],
			});
		} else {
			data_all_review = await Review.findAll({
				include: [
					{ model: OrderDetail, include: [{ model: Order }, { model: Product }] },
					{ model: Customer },
				],
				order: [
					['rating', 'ASC'],
					['createdAt', 'ASC'],
				],
			});
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

		return res.status(output.status).json(output);
	} catch (err) {
		return res.status(500).json(err.message);
	}
};

module.exports = {
	getAllReview,
};
