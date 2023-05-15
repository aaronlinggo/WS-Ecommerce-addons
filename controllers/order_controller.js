const { Op } = require('sequelize');
const { Customer, Order, Product, Payment, OrderDetail } = require('../models');

const jwt = require('jsonwebtoken');
const { output } = require('pdfkit');
require('dotenv').config();

const getAllOrder = async (req, res) => {
	var token = req.header('x-auth-token');
	dev = jwt.verify(token, process.env.JWT_KEY);

	let { code_order } = req.params;
	let { sortBySubtotal, searchByStatusPayment, searchByStatusOrder } = req.query;
	var data_all_order;

	try {
		// kalau ada code_order, cuman nampilin berdasarkan code_order tertentu
		// secara default, tampilannya ASC
		if (code_order) {
			let data_order = await Payment.findOne({
				include: [
					{
						model: Order,
						where: { codeOrder: code_order },
						include: [
							{
								model: Customer,
								where: { developerId: dev.id },
							},
						],
					},
				],
			});

			if (!data_order) {
				return res.formatter.notFound('Order not found!');
			} else {
				const output = {
					status: 200,
					body: {
						'Customer Name':
							data_order.Order.Customer.firstName +
							' ' +
							data_order.Order.Customer.lastName,
						'Customer Address': data_order.Order.address,
						'Order Details': {
							'Order Code': data_order.codeOrder,
							'Order Status': data_order.Order.statusOrder,
							'Origin Town': data_order.Order.origin,
							'Destination Town': data_order.Order.destination,
							'Item Weight': data_order.Order.weight + ' gram',
							'Courier JNE': data_order.Order.courierJne,
							'Courier Cost': 'Rp ' + data_order.Order.costCourier + ',00',
						},
						'Payment Details': {
							'Payment Code': data_order.codePayment,
							'Payment Status': data_order.paymentStatus,
							'Subtotal Payment': 'Rp ' + data_order.subtotal + ',00',
						},
					},
				};
				return res.status(output.status).json(output);
			}
		}
		// tampilkan semua data order
		else {
			if (sortBySubtotal) {
				// di sortBySubtotal
				data_all_order = await Payment.findAll({
					include: [
						{
							model: Order,
							include: [
								{ 
									model: Customer 
								}
							],
						},
					],
					where: { $developerId$: dev.id },
					order: [['subtotal', sortBySubtotal.toUpperCase()]],
				});
			} else if (searchByStatusPayment) {
				// di searchByStatusPayment
				data_all_order = await Payment.findAll({
					include: [
						{
							model: Order,
							include: [{ model: Customer }],
						},
					],
					where: {
						$developerId$: dev.id,
						paymentStatus: searchByStatusPayment.toLowerCase(),
					},
				});
			} else if (searchByStatusOrder) {
				// di searchByStatusOrder
				data_all_order = await Payment.findAll({
					include: [
						{
							model: Order,
							include: [{ model: Customer }],
							where: {
								statusOrder: searchByStatusOrder.toUpperCase(),
							},
						},
					],
					where: { $developerId$: dev.id },
				});
			} else {
				// kalau ga di sort / search, secara otomatis tampil semua orderBy ASC
				data_all_order = await Payment.findAll({
					include: [
						{
							model: Order,
							include: [
								{
									model: Customer,
								},
							],
						},
					],
					where: { $developerId$: dev.id },
				});
			}
		}

		const output = {
			status: 200,
			body: data_all_order.map((orders) => ({
				'Customer Name':
					orders.Order.Customer.firstName + ' ' + orders.Order.Customer.lastName,
				'Customer Address': orders.Order.address,
				'Order Details': {
					'Order Code': orders.codeOrder,
					'Order Status': orders.Order.statusOrder,
					'Origin Town': orders.Order.origin,
					'Destination Town': orders.Order.destination,
					'Item Weight': orders.Order.weight + ' gram',
					'Courier JNE': orders.Order.courierJne,
					'Courier Cost': 'Rp ' + orders.Order.costCourier + ',00',
				},
				'Payment Details': {
					'Payment Code': orders.codePayment,
					'Payment Status': orders.paymentStatus,
					'Subtotal Payment': 'Rp ' + orders.subtotal + ',00',
				},
			})),
		};

		return res.status(output.status).json(output);
	} catch (err) {
		return res.status(500).json(err.message);
	}
};

// NOMOR 11
const getAllRequestOrder = async (req, res) => {
	var token = req.header('x-auth-token');
	dev = jwt.verify(token, process.env.JWT_KEY);

	try {
		let data_all_order = await OrderDetail.findAll({
			include: [
				{
					model: Order,
					where: { statusOrder: 'PENDING' },
					include: [{ model: Customer, where: { developerId: dev.id } }],
				},
				{ model: Product },
			],
		});

		if (!data_all_order) {
			return res.formatter.notFound('Order not found!');
		}

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
	var token = req.header('x-auth-token');
	dev = jwt.verify(token, process.env.JWT_KEY);

	let { id } = req.params;
	let prev_status, new_status;

	try {
		let data_payment = await Payment.findOne({
			where: { codeOrder: id },
			include: [
				{
					model: Order,
					where: { codeOrder: id },
					include: [{ model: Customer, where: { developerId: dev.id } }],
				},
			],
		});

		if (!data_payment) {
			return res.formatter.notFound('Payment not found!');
		}

		let data_order = await OrderDetail.findOne({
			where: { codeOrder: id },
			include: [
				{
					model: Order,
					where: { codeOrder: id },
					include: [{ model: Customer, where: { developerId: dev.id } }],
				},
				{ model: Product },
			],
		});

		if (!data_order) {
			return res.formatter.notFound('Order not found!');
		}

		prev_status = data_order.Order.statusOrder;

		if (data_payment.paymentStatus === 'paid') {
			if (data_order.Order.statusOrder === 'PENDING') {
				await data_order.Order.update({ statusOrder: 'PROCESS' });
				new_status = data_order.Order.statusOrder;

				resCode = 200;
				message = 'Order successfully received and processed!';
			} else {
				resCode = 409;
				message = 'Order cannot be accepted (status != pending)!';
			}
		} else if (data_payment.paymentStatus === 'unpaid') {
			await data_order.Order.update({ statusOrder: 'CANCEL' });
			new_status = data_order.Order.statusOrder;

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
					'Previous Order Status': prev_status,
					'New Order Status': new_status,
					'Payment Status': data_payment.paymentStatus,
					'Origin Town': data_order.Order.origin,
					'Destination Town': data_order.Order.destination,
					'Courier JNE': data_order.Order.courierJne,
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
	var token = req.header('x-auth-token');
	dev = jwt.verify(token, process.env.JWT_KEY);

	let { id } = req.params;
	let prev_status, new_status;

	try {
		let data_order = await OrderDetail.findOne({
			where: { codeOrder: id },
			include: [
				{
					model: Order,
					where: { codeOrder: id },
					include: [{ model: Customer, where: { developerId: dev.id } }],
				},
				{ model: Product },
			],
		});

		if (!data_order) {
			return res.formatter.notFound('Order not found!');
		}

		prev_status = data_order.Order.statusOrder;

		if (data_order.Order.statusOrder === 'PROCESS') {
			await data_order.Order.update({ statusOrder: 'DELIVERED' });
			new_status = data_order.Order.statusOrder;

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
					'Previous Order Status': prev_status,
					'New Order Status': new_status,
					'Origin Town': data_order.Order.origin,
					'Destination Town': data_order.Order.destination,
					'Courier JNE': data_order.courierJne,
				},
			},
		};

		return res.status(output.status).json(output);
	} catch (err) {
		return res.status(500).json(err.message);
	}
};

// NOMOR 14
const cancelOrder = async (req, res) => {
	var token = req.header('x-auth-token');
	dev = jwt.verify(token, process.env.JWT_KEY);

	let { id } = req.params;
	let prev_status, new_status;

	try {
		let data_order = await OrderDetail.findOne({
			where: { codeOrder: id },
			include: [
				{
					model: Order,
					where: { codeOrder: id },
					include: [{ model: Customer, where: { developerId: dev.id } }],
				},
				{ model: Product },
			],
		});

		if (!data_order) {
			return res.formatter.notFound('Order not found!');
		}

		prev_status = data_order.Order.statusOrder;

		if (
			data_order.Order.statusOrder !== 'CANCEL' &&
			data_order.Order.statusOrder !== 'DELIVERED'
		) {
			await data_order.Order.update({ statusOrder: 'CANCEL' });
			new_status = data_order.Order.statusOrder;

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
					'Previous Order Status': prev_status,
					'New Order Status': new_status,
					'Origin Town': data_order.Order.origin,
					'Destination Town': data_order.Order.destination,
					'Courier JNE': data_order.Order.courierJne,
				},
			},
		};

		return res.status(output.status).json(output);
	} catch (err) {
		return res.status(500).json(err.message);
	}
};

module.exports = {
	getAllRequestOrder,
	acceptOrder,
	completeOrder,
	cancelOrder,
	getAllOrder,
};
