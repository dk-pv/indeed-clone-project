// middleware/errorHandler.js

const errorHandler = (err, req, res, next) => {
  console.error("Error Stack:", err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
};

export default errorHandler;
