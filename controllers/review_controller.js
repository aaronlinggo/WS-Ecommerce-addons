const { Review, Order, Customer, Product, OrderDetail, Sequelize } = require('../models');

// NOMOR 10
const seeAllReview = async (req, res) => {
	try {
		let data_all_review = await Review.findAll({
			include: [
				{ model: OrderDetail, include: [{ model: Order }, { model: Product }] },
				{ model: Customer },
			],
			order: [
				[ Sequelize.col('rating'), 'DESC' ],
				[ Sequelize.col('createdAt'), 'DESC' ],
			],
		});

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
	seeAllReview,
};
