const { Customer, Order, Product, Payment } = require('../models');

// NOMOR 11
const seeAllRequestOrder = async (req, res) => {
  let data_all_order = await Order.findAll({
    where: { statusOrder: 'PENDING' },
    include: [
      {
        model: Customer,
        attributes: ['firstName', 'lastName']
      },
      {
        model: Product,
        attributes: ['name']
      }
    ]
  });

  const output = {
    status: 200,
    body: data_all_order.map((orders) => ({
      'Customer Name': orders.Customer.firstName + ' ' + orders.Customer.lastName,
      'Product Name': orders.Product.name,
      'Order Details': {
        'Code': orders.codeOrder,
        'Origin': orders.origin,
        'Destination': orders.destination,
        'Weight': orders.weight,
        'Courier JNE': orders.courierJne,
        'Courier Cost': orders.costCourier,
        'Status': orders.statusOrder,
      }
    })),
  };

  return res.status(output.status).json(output);
}

// NOMOR 12
const acceptOrder = async (req, res) => {
  let { id } = req.params;

  let data_payment = await Payment.findOne({
    where: { codeOrder: id },
  });

  let data_order = await Order.findOne({
    where: { codeOrder: id },
    include: [
      {
        model: Customer,
        attributes: ['firstName', 'lastName'],
      },
      {
        model: Product,
        attributes: ['name'],
      },
    ],
  });

  if (data_payment.paymentStatus === 'paid') {
    if (data_order.statusOrder === 'PENDING') {
      await data_order.update(
        { statusOrder: 'PROCESS' }
      );
      resCode = 200;
      message = 'Order successfully received and processed!';
    }
    else {
      resCode = 409;
      message = 'Order cannot be accepted (status != pending)!';
    }
  }
  else if (data_payment.paymentStatus === 'unpaid') {
    await data_order.update(
      { statusOrder: 'CANCEL' }
    );
    resCode = 402;
    message = 'Order failed to be received and was rejected!';
  }

  const output = {
    status: resCode,
    message: message,
    body: {
      'Customer Name': data_order.Customer.firstName + ' ' + data_order.Customer.lastName,
      'Product Name': data_order.Product.name,
      'Order Details': {
        'Code': data_order.codeOrder,
        'Origin': data_order.origin,
        'Destination': data_order.destination,
        'Courier JNE': data_order.courierJne,
        'Status': data_order.statusOrder,
        'Status Payment': data_payment.paymentStatus
      }
    }
  };

  return res.status(output.status).json(output);
}

// NOMOR 13
const completeOrder = async (req, res) => {
  let { id } = req.params;

  let data_order = await Order.findOne({
    where: { codeOrder: id },
    include: [
      {
        model: Customer,
        attributes: ['firstName', 'lastName'],
      },
      {
        model: Product,
        attributes: ['name'],
      },
    ],
  });

  if (data_order.statusOrder === 'PROCESS') {
    await data_order.update(
      { statusOrder: 'DELIVERED' }
    );
    resCode = 200;
    message = 'Order has been successfully shipped!'
  }
  else if (data_order.statusOrder === 'DELIVERED') {
    resCode = 409;
    message = "Order already delivered!";
  }
  else {
    resCode = 404;
    message = 'Order not already processed!'
  }

  const output = {
    status: resCode,
    message: message,
    body: {
      'Customer Name': data_order.Customer.firstName + ' ' + data_order.Customer.lastName,
      'Product Name': data_order.Product.name,
      'Order Details': {
        'Code': data_order.codeOrder,
        'Origin': data_order.origin,
        'Destination': data_order.destination,
        'Courier JNE': data_order.courierJne,
        'Status': data_order.statusOrder,
      }
    }
  };

  return res.status(output.status).json(output);
}

// NOMOR 14
const cancelOrder = async (req, res) => {
  let { id } = req.params;

  let data_order = await Order.findOne({
    where: { codeOrder: id },
    include: [
      {
        model: Customer,
        attributes: ['firstName', 'lastName'],
      },
      {
        model: Product,
        attributes: ['name'],
      },
    ],
  });

  if (data_order.statusOrder !== 'CANCEL' && data_order.statusOrder !== 'DELIVERED') {
    await data_order.update(
      { statusOrder: 'CANCEL' }
    );
    resCode = 200;
    message = 'Order successfully cancelled!'
  }
  else if (data_order.statusOrder === 'CANCEL') {
    resCode = 410;
    message = 'Order already cancelled!';
  }
  else {
    resCode = 403;
    message = 'Order cannot be cancelled!';
  }

  const output = {
    status: resCode,
    message: message,
    body: {
      'Customer Name': data_order.Customer.firstName + ' ' + data_order.Customer.lastName,
      'Product Name': data_order.Product.name,
      'Order Details': {
        'Code': data_order.codeOrder,
        'Origin': data_order.origin,
        'Destination': data_order.destination,
        'Courier JNE': data_order.courierJne,
        'Status': data_order.statusOrder,
      }
    }
  };

  return res.status(output.status).json(output);
};

module.exports = {
  seeAllRequestOrder,
  acceptOrder,
  completeOrder,
  cancelOrder
};