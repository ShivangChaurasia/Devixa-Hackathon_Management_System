export class AppError extends Error {
  constructor(message, statusCode = 500, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad Request', errors = null) {
    super(message, 400, errors);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access', errors = null) {
    super(message, 401, errors);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden access', errors = null) {
    super(message, 403, errors);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', errors = null) {
    super(message, 404, errors);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource conflict', errors = null) {
    super(message, 409, errors);
  }
}
