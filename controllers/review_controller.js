const db = require("../models");

module.exports = {
  getReviewProduct: () => {
    try {
      const review = db["Review"].findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });

      return review;
    } catch (err) {
      throw err;
    }
  },
};
