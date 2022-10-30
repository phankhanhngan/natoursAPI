const mongoose = require('mongoose');
const Tour = require('./tourModel');
const AppError = require('../utils/appError');

const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Booking must belong to a tour.']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a user.']
  },
  price: {
    type: Number,
    required: [true, 'Booking must have a price.']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  paid: {
    type: Boolean,
    default: true
  },
  selectedDate: {
    type: Date
  }
});

bookingSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name'
  // })
  this.populate('user');
  next();
});

bookingSchema.pre('save', async function (next) {
  console.log('this:', this);
  const tour = await Tour.findById(this.tour);
  console.log('HI', this.selectedDate);
  let startDate = {};
  for (let i = 0; i < tour.startDates.length; i++) {
    if (
      tour.startDates[i].date.getDay() === this.selectedDate.getDay() &&
      tour.startDates[i].date.getMonth() === this.selectedDate.getMonth() &&
      tour.startDates[i].date.getFullYear() === this.selectedDate.getFullYear()
    ) {
      startDate = tour.startDates[i];
      break;
    }
  }
  if (startDate.soldOut) {
    next(
      new AppError(
        'Tour starts at this date has been already sold out! Please choose another date!',
        400
      )
    );
  }
  startDate.participants += 1;
  await tour.save({ validateBeforeSave: false });

  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
