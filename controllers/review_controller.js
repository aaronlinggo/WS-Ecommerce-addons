const { Review, Order, Customer, Product, OrderDetail } = require('../models');

// NOMOR 10
const seeAllReview = async (req, res) => {
  let data_all_review = await Review.findAll({
    include: [
      {
        model: Order,
        attributes: ['courierJne'],
        include: [
          {
            model: OrderDetail,
            include: [
              {
                model: Product,
                attributes: ['name']
              }
            ]
          }
        ],
      },
      {
        model: Customer,
        attributes: ['firstName', 'lastName'],
      },
    ],
  });

  const output = {
    status: 200,
    body: data_all_review.map((review) => ({
      'Customer Name': review.Customer.firstName + ' ' + review.Customer.lastName,
      'Product Name': review.Order.OrderDetail.Product.name,
      'Product Price': review.Order.OrderDetail.Product.price,
      'Courier JNE': review.Order.courierJne,
      'Review': {
        'Rating': review.rating,
        'Comment': review.comment
      }
    })),
  };

  return res.status(output.status).json(output);
}

module.exports = {
  seeAllReview
};