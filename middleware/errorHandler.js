const AppError = require('../errors/AppError');

// Global error-handling middleware
module.exports = (err, req, res, next) => {
  if (!(err instanceof AppError)) {
    console.error('Unexpected Error:', err);
    err = new AppError('Internal Server Error', 500);
  }

  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message
  });
};
