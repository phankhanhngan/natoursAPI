const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('./../controllers/authController');

//mergeParams: true để get access to tourID bên tourRoute
const router = express.Router({ mergeParams: true });

// Get all reviews

router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  // /reviews hoặc /tours/tourId/reviews
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  )
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  );

//Create new review

module.exports = router;
