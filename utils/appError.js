class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    //this prop is used to make sure only operational error will be AppError and
    //be handled. Not for other errors such as programming errors
    this.isOperational = true;
    //stack trace (current Obj, Error class itself)
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
