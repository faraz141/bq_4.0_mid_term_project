// Success response helper
const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    status: 'success',
    message,
    data
  });
};

// Error response helper
const errorResponse = (res, message = 'Error occurred', statusCode = 500, errors = null) => {
  const response = {
    status: 'error',
    message
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

// Pagination helper
const paginateResponse = (data, page, limit, total) => {
  return {
    data,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1
    }
  };
};

// Validation error response
const validationErrorResponse = (res, errors) => {
  return res.status(400).json({
    status: 'error',
    message: 'Validation failed',
    errors: errors.array().map(error => ({
      field: error.param,
      message: error.msg,
      value: error.value
    }))
  });
};

// Not found response
const notFoundResponse = (res, resource = 'Resource') => {
  return res.status(404).json({
    status: 'error',
    message: `${resource} not found`
  });
};

// Unauthorized response
const unauthorizedResponse = (res, message = 'Unauthorized access') => {
  return res.status(401).json({
    status: 'error',
    message
  });
};

// Forbidden response
const forbiddenResponse = (res, message = 'Access forbidden') => {
  return res.status(403).json({
    status: 'error',
    message
  });
};

module.exports = {
  successResponse,
  errorResponse,
  paginateResponse,
  validationErrorResponse,
  notFoundResponse,
  unauthorizedResponse,
  forbiddenResponse
};
