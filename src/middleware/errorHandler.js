export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'CastError') {
    message = `Resource not found with id of ${err.value}`;
    statusCode = 404;
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'Field';
    message = `${field} already exists`;
    statusCode = 409;
  }

  if (err.name === 'ValidationError') {
    message = Object.values(err.errors).map(val => val.message).join(', ');
    statusCode = 422;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};