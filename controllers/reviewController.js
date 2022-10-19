const Review = require('./../models/reviewModel');
const factory = require('./handlerFactory');
const Booking = require('../models/bookingModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.setTourUserIds = (req, res, next) => {
  // nếu k nhập id tour vào thì lấy id ở url
  //allow nested route
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.restrictCreateReview = catchAsync(async (req, res, next) => {
  const tour = await Booking.findOne({
    tour: req.body.tour,
    user: req.body.user
  });

  if (!tour) {
    return next(
      new AppError(
        'You have not booked this tour yet. Book this tour to review!'
      )
    );
  }
  next();
});

exports.getAllReviews = factory.getAll(Review);

exports.getReview = factory.getOne(Review);

exports.createReview = factory.createOne(Review);

exports.updateReview = factory.updateOne(Review);

exports.deleteReview = factory.deleteOne(Review);
