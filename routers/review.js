const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync');
const reviewControls = require('../controller/review')
const { isLoggedIn, isReviewAuthor, validateReviews } = require('../middleware/middleware');

router.post('/', validateReviews, catchAsync(reviewControls.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviewControls.deleteReview))

module.exports = router