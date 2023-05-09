const express = require('express');
const router = express.Router();

const review_controller = require('../controllers/review_controller');

router.get('/seeAllReviews', review_controller.seeAllReview);

module.exports = router;