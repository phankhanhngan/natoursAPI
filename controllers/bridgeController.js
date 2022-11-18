const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');

exports.likeTour = catchAsync(async (req, res, next) => {
  let type = 'like';
  const tour = await Tour.findById(req.params.id);
  const user = await User.findById(req.user.id);

  if (!tour || !user) {
    return next(new AppError('Please try again!', 404));
  }

  //check if user already liked the tour
  if (tour.favoriteBy.indexOf(req.user._id) !== -1) {
    tour.favoriteBy.splice(tour.favoriteBy.indexOf(req.user.id), 1);
    user.favoriteTours.splice(user.favoriteTours.indexOf(req.params.id), 1);
    type = 'unlike';
  } else {
    tour.favoriteBy.push(req.user.id);
    user.favoriteTours.push(tour._id);
  }
  await tour.save();
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    status: 'success',
    data: {
      type,
      data: tour
    }
  });
});
