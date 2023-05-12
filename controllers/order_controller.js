const { Op } = require('sequelize');
const {
	Customer,
	Order,
	Product,
	Payment,
	OrderDetail,
	Sequelize,
} = require('../models');

const getAllOrder = async (req, res) => {
	let { orderBy } = req.query;

	try {
		let data_all_order = await OrderDetail.findAll({
			include: [
				{
					model: Order,
					include: [{ model: Customer }],
				},
				{ model: Product },
			],
			order: [[Sequelize.col('createdAt'), 'DESC']],
		});

		return res.status(200).json(data_all_order);
	} catch (err) {
		return res.status(500).json(err.message);
	}
};

// NOMOR 11
const seeAllRequestOrder = async (req, res) => {
	try {
		let data_all_order = await OrderDetail.findAll({
			include: [
				{
					model: Order,
					where: { statusOrder: 'PENDING' },
					include: [{ model: Customer }],
				},
				{ model: Product },
			],
			order: [[Sequelize.col('createdAt'), 'DESC']],
		});

		const output = {
			status: 200,
			body: data_all_order.map((orders) => ({
				'Customer Name':
					orders.Order.Customer.firstName + ' ' + orders.Order.Customer.lastName,
				'Product Name': orders.Product.name,
				'Order Details': {
					'Order Code': orders.codeOrder,
					'Origin Town': orders.Order.origin,
					'Destination Town': orders.Order.destination,
					'Item Weight': orders.Order.weight + ' gram',
					'Courier JNE': orders.Order.courierJne,
					'Courier Cost': 'Rp ' + orders.Order.costCourier + ',00',
					'Order Status': orders.Order.statusOrder,
				},
			})),
		};

		return res.status(output.status).json(output);
	} catch (err) {
		return res.status(500).json(err.message);
	}
};

// NOMOR 12
const acceptOrder = async (req, res) => {
	try {
		let { id } = req.params;

		let data_payment = await Payment.findOne({
			where: { codeOrder: id },
		});

		let data_order = await OrderDetail.findOne({
			where: { codeOrder: id },
			include: [
				{
					model: Order,
					where: { codeOrder: id },
					include: [{ model: Customer }],
				},
				{ model: Product },
			],
		});

		if (data_payment.paymentStatus === 'paid') {
			if (data_order.Order.statusOrder === 'PENDING') {
				await data_order.Order.update({ statusOrder: 'PROCESS' });
				resCode = 200;
				message = 'Order successfully received and processed!';
			} else {
				resCode = 409;
				message = 'Order cannot be accepted (status != pending)!';
			}
		} else if (data_payment.paymentStatus === 'unpaid') {
			await data_order.Order.update({ statusOrder: 'CANCEL' });
			resCode = 402;
			message = 'Order failed to be received and was rejected!';
		}

		const output = {
			status: resCode,
			message: message,
			body: {
				'Customer Name':
					data_order.Order.Customer.firstName +
					' ' +
					data_order.Order.Customer.lastName,
				'Product Name': data_order.Product.name,
				'Order Details': {
					'Order Code': data_order.codeOrder,
					'Origin Town': data_order.Order.origin,
					'Destination Town': data_order.Order.destination,
					'Courier JNE': data_order.Order.courierJne,
					'Order Status': data_order.Order.statusOrder,
					'Payment Status': data_payment.paymentStatus,
				},
			},
		};

		return res.status(output.status).json(output);
	} catch (err) {
		return res.status(500).json(err.message);
	}
};

// NOMOR 13
const completeOrder = async (req, res) => {
	let { id } = req.params;

	let data_order = await OrderDetail.findOne({
		where: { codeOrder: id },
		include: [
			{
				model: Order,
				where: { codeOrder: id },
				include: [{ model: Customer }],
			},
			{ model: Product },
		],
	});

	if (data_order.Order.statusOrder === 'PROCESS') {
		await data_order.Order.update({ statusOrder: 'DELIVERED' });
		resCode = 200;
		message = 'Order has been successfully shipped!';
	} else if (data_order.Order.statusOrder === 'DELIVERED') {
		resCode = 409;
		message = 'Order already delivered!';
	} else {
		resCode = 404;
		message = 'Order not already processed!';
	}

	const output = {
		status: resCode,
		message: message,
		body: {
			'Customer Name':
				data_order.Order.Customer.firstName +
				' ' +
				data_order.Order.Customer.lastName,
			'Product Name': data_order.Product.name,
			'Order Details': {
				'Order Code': data_order.codeOrder,
				'Origin Town': data_order.Order.origin,
				'Destination Town': data_order.Order.destination,
				'Courier JNE': data_order.courierJne,
				'Order Status': data_order.Order.statusOrder,
			},
		},
	};

	return res.status(output.status).json(output);
};

// NOMOR 14
const cancelOrder = async (req, res) => {
	let { id } = req.params;

	let data_order = await OrderDetail.findOne({
		where: { codeOrder: id },
		include: [
			{
				model: Order,
				where: { codeOrder: id },
				include: [{ model: Customer }],
			},
			{ model: Product },
		],
	});

	if (
		data_order.Order.statusOrder !== 'CANCEL' &&
		data_order.Order.statusOrder !== 'DELIVERED'
	) {
		await data_order.Order.update({ statusOrder: 'CANCEL' });
		resCode = 200;
		message = 'Order successfully cancelled!';
	} else if (data_order.Order.statusOrder === 'CANCEL') {
		resCode = 410;
		message = 'Order already cancelled!';
	} else {
		resCode = 403;
		message = 'Order cannot be cancelled!';
	}

	const output = {
		status: resCode,
		message: message,
		body: {
			'Customer Name':
				data_order.Order.Customer.firstName +
				' ' +
				data_order.Order.Customer.lastName,
			'Product Name': data_order.Product.name,
			'Order Details': {
				'Order Code': data_order.codeOrder,
				'Origin Town': data_order.Order.origin,
				'Destination Town': data_order.Order.destination,
				'Courier JNE': data_order.Order.courierJne,
				'Order Status': data_order.Order.statusOrder,
			},
		},
	};

	return res.status(output.status).json(output);
};

module.exports = {
	seeAllRequestOrder,
	acceptOrder,
	completeOrder,
	cancelOrder,
	getAllOrder,
};
