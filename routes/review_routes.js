const express = require('express');
const router = express.Router();

const review = require('../controllers/review_controller');

// lihat review product
router.get('/', async (req, res) => {
  let reviews = await review.getReviewProduct();

  const output = {
    status: 200,
    body: {
      reviews,
    },
  };

  return res.status(200).json(output);
});

module.exports = router;