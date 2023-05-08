const { Review, Order, Customer, Product, OrderDetail } = require('../models');

// NOMOR 10
const seeAllReview = async (req, res) => {
  let data_all_review = await Review.findAll();

  // const output = {
  //   status: 200,
  //   body: data_all_review.map((review) => ({
  //     'Customer Name': review.Customer.firstName + ' ' + review.Customer.lastName,
  //     'Product Name': review.Order.OrderDetail.Product.name,
  //     'Product Price': review.Order.OrderDetail.Product.price,
  //     'Courier JNE': review.Order.courierJne,
  //     'Review': {
  //       'Rating': review.rating,
  //       'Comment': review.comment
  //     }
  //   })),
  // };

  return res.status(200).json(data_all_review);
}

module.exports = {
  seeAllReview
};