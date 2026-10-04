function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
}

function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === "ZodError") {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.issues
    });
  }

  if (err.code === "23505") {
    return res.status(409).json({
      success: false,
      message: "A record with this value already exists."
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error"
  });
}

module.exports = { notFound, errorHandler };
