const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal than 40 characters'],
      minlength: [10, 'A tour name must have less or equal than 40 characters']
      // validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          //this only points to current doc on NEW doc creation. Not for UPDATE
          return val < this.price;
        },
        //({VALUE}) is val is what we input for priceDiscount
        message: 'Discount price ({VALUE}) should be below regular price'
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    // startDates: [Date],
    startDates: [{ date: Date, participants: Number, soldOut: Boolean }],
    secretTour: {
      type: Boolean,
      default: false
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      //array of number - latitude and longitude
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ],
    favoriteBy: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// single field index
// tourSchema.index({ price: 1 });

//compound index
tourSchema.index({ price: 1, ratingsAverage: -1 });

//for query tours by slugs
tourSchema.index({ slug: 1 });

//for geospatial queries
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('durationWeek').get(function () {
  return this.duration / 7;
});

// Virtual Populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'tour'
});

// DOCUMENT MIDDLEWARE: runs before save(), create()
tourSchema.pre('save', function (next) {
  //this is the current document before it is saved into db
  this.slug = slugify(this.name, { lower: true });
  next();
});

// EMBEDDING USER INTO TOURS

// tourSchema.pre('save', async function(next) {
//   //await User.findById return promise
//   const guidesPromises = this.guides.map(async id => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// tourSchema.pre('save', function(next) {
//   console.log('Will save document...');
//   next();
// });
//
// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

//QUERY MIDDLEWARE:
//not working for findOne
//all query starts with find
tourSchema.pre(/^find/, function (next) {
  // tourSchema.pre('find',function(next){
  //this: query obj
  //it chains another find method to the current query
  this.find({ secretTour: { $ne: true } });
  //this is current query which is the normal obj => we can add any prop
  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  });

  next();
});

tourSchema.pre('save', async function (next) {
  this.startDates.forEach((el) => {
    if (el.participants === this.maxGroupSize) {
      el.soldOut = true;
    }
  });
  next();
});

// tourSchema.post(/^find/, function (docs, next) {
//   // console.log(docs);
//   console.log(`This query took: ${Date.now() - this.start} milliseconds`);
//   next();
// });

//AGGREGATION MIDDLEWARE
// tourSchema.pre('aggregate', function (next) {
//   //pipeline is an array composed of many stages
//   //so use unshift to add another stage to the beginning
//   this._pipeline.unshift({ $match: { secretTour: { $ne: true } } });
//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
