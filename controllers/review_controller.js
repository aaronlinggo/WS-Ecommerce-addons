const { Review, Order, Customer, Product, OrderDetail } = require('../models');

// NOMOR 10
const seeAllReview = async (req, res) => {
  let data_all_review = await Review.findAll({
    include: [
      {
        model: OrderDetail,
        include: [
          {
            model: Order,
            attributes: ['courierJne']
          },
          {
            model: Product,
            attributes: ['name', 'price']
          }
        ]
      },
      {
        model: Customer,
        attributes: ['firstName', 'lastName']
      }
    ]
  });

  const output = {
    status: 200,
    body: data_all_review.map((review) => ({
      'Customer Name': review.Customer.firstName + ' ' + review.Customer.lastName,
      'Product Name': review.OrderDetail.Product.name,
      'Product Price': 'Rp ' + review.OrderDetail.Product.price + ',00',
      'Courier JNE': review.OrderDetail.Order.courierJne,
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