const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}!`;
  //400: bad request
  return new AppError(message, 400);
}

const handleDuplicateFieldDB = err => {
  const value = err.keyValue.name;
  const message = `Duplicate field value: ${value}. Please use another value.`
  return new AppError(message,400);
}

const handleValidationErrorDB = err => {
  // return an array of errors in err then map to get only messages
  const errors = Object.values(err.errors).map(el => el.message); //an array of error messages
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message,400);
}

const handleJWTError = () => new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () => new AppError('Your token has expired. Please log in again!', 401);

const sendErrorDev = (err,res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err,res) => {
  //Operational, send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    //Programming or unknown err, don't leak err details
  } else {
    // 1) Log error
    console.log('ERROR', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }
};

module.exports = (err,req,res,next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if(process.env.NODE_ENV === 'development') {
    sendErrorDev(err,res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = {};
    if (err.name === 'CastError') error = handleCastErrorDB(err);
    if (err.code === 11000) error = handleDuplicateFieldDB(err);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
    // sendErrorProd(err,res);
    sendErrorProd(error,res);
  }
};