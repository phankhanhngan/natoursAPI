const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const Review = require('../models/reviewModel');

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking') {
    res.locals.alert = 'Your booking was successful! Please check your email';
  }
  next();
};

exports.getOverview = catchAsync(async (req, res) => {
  // 1) Get Tour data from collection
  const tours = await Tour.find();

  // 2) Build template

  // 3) Render that template using tour data form 1)
  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
});

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });
  // 2) Find tours with the returned IDs
  const tourIDs = bookings.map((el) => el.tour);

  //$in: select all the tours that have id in tourIDs array
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });
  // 2) Build template

  if (!tour) {
    return next(new AppError('There is no tour with that name!', 404));
  }

  const bookedTour = await Booking.find({
    tour: tour.id,
    user: req.user.id
  });

  const reviewedTour = await Review.find({ tour: tour.id, user: req.user.id });

  console.log(bookedTour, reviewedTour);
  // 3) Render template using data from 1)
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
    bookedTour,
    reviewedTour
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};

exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Sign up for an account'
  });
};

exports.getReviewForm = catchAsync(async (req, res) => {
  const tour = await Tour.findById(req.params.tourId);
  res.status(200).render('review', {
    title: 'Review',
    tour
  });
});

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  });
};

exports.updateUserData = async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );
  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser
  });
};
