import httpStatus from 'http-status-codes';

class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = httpStatus.UNAUTHORIZED;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
class NotFound extends Error {
  statusCode: number;

  constructor(message: string = 'Data tidak ditemukan') {
    super(message);
    this.name = 'NotFound';
    this.statusCode = httpStatus.NOT_FOUND;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}


class ForbiddenError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = httpStatus.FORBIDDEN;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

class GeneralError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

class ValidationError extends Error {
  statusCode: number;
  validationMessage: string;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.validationMessage = message;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

class ApiError extends Error {
  statusCode: number;
  name: string;
  message: string;

  constructor(statusCode: number, codeName: string, message: string) {
    super(message);
    this.name = codeName;
    this.statusCode = statusCode;
    this.message = message;
  }
}

export {
  UnauthorizedError,
  GeneralError,
  ValidationError,
  ForbiddenError,
  ApiError,
  NotFound
};