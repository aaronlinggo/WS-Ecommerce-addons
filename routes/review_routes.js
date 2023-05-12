const express = require('express');
const router = express.Router();

const review_controller = require('../controllers/review_controller');

router.get('/getAllReviews', review_controller.getAllReview);

module.exports = router;