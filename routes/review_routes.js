const express = require('express');
const router = express.Router();

const review_controller = require('../controllers/review_controller');
const authMiddleware = require("../middleware/AuthMiddleware")

router.get('/seeAllReviews', authMiddleware.authMiddleware, review_controller.seeAllReview);

module.exports = router;