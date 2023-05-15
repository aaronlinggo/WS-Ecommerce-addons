const express = require('express');
const router = express.Router();

const review_controller = require('../controllers/review_controller');
const authMiddleware = require('../middleware/AuthMiddleware');

router.get('/getAllReviews', authMiddleware.developerMiddleware, review_controller.getAllReview);

module.exports = router;