import httpStatus from 'http-status';
import { env } from 'process';
import { logger } from '../lib/logger/index.js';

class HttpError extends Error {
  constructor(message = 'Terjadi kesalahan') {
    super(message);
    this.name = this.constructor.name;
    this.http_code = httpStatus.INTERNAL_SERVER_ERROR;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFound extends HttpError {
  constructor(message = 'Data tidak ditemukan') {
    super(message);
    this.http_code = httpStatus.NOT_FOUND;
  }
}

class Unauthenticated extends HttpError {
  constructor(message = 'Autentikasi diperlukan') {
    super(message);
    this.http_code = httpStatus.UNAUTHORIZED;
  }
}

class BadRequest extends HttpError {
  constructor(message = 'Data tidak valid') {
    super(message);
    this.http_code = httpStatus.BAD_REQUEST;
  }
}

class Forbidden extends HttpError {
  constructor(message = 'Akses ditolak') {
    super(message);
    this.http_code = httpStatus.FORBIDDEN;
  }
}

class ServerError extends HttpError {
  constructor(message = 'Terjadi kesalahan') {
    super(message);
    this.http_code = httpStatus.INTERNAL_SERVER_ERROR;
  }
}

const exception = (err, req, res) => {
  let httpCode = err.http_code || 500,
    message = err.message || 'Terjadi kesalahan',
    data = undefined,
    stack = env.NODE_ENV == 'development' ? err?.stack?.split('\n') : undefined;

  if (env.NODE_ENV == 'development') console.log(err);

  if (err.code == 'P2003') {
    httpCode = httpStatus.UNPROCESSABLE_ENTITY;
    message = 'Tidak dapat mengubah data ini karena terkait dengan data lain.';
  } else if (err.name == 'PrismaClientValidationError') {
    httpCode = httpStatus.BAD_REQUEST;
    if (err.message.includes('Unknown argument')) {
      const part = err.message.match(/Unknown argument `[^`]+`/);
      message = part ? part[0] : 'Unknown argument on request';
    } else if (err.message.includes('Unknown field')) {
      const part = err.message.match(
        /Unknown field `[^`]+` for select statement`/
      );
      message = part ? part[0] : 'Unknown field name on request';
    }
  } else if (
    err.name == 'PrismaClientKnownRequestError' &&
    err.code == 'P2025'
  ) {
    httpCode = httpStatus.NOT_FOUND;
    message = `${err.meta?.modelName ?? 'Data'} tidak ditemukan`;
  } else if (
    err.name == 'PrismaClientKnownRequestError' &&
    err.code == 'P2002'
  ) {
    httpCode = httpStatus.CONFLICT;
    const target = err.meta?.target;
    if (target)
      message = `Entri dengan nilai yang sama untuk ${target} sudah ada.`;
    else message = 'Terdapat nilai yang duplikat';
  } else if (err.name == 'ValidationError' && err.details) {
    httpCode = httpStatus.UNPROCESSABLE_ENTITY;
    message = 'Data tidak dapat diproses';
    data = err.details.map((det) => det.message);
  } else if (err instanceof HttpError) {
    httpCode = err.http_code;
    message = err.message;
  } else {
    logger.error(err);
  }

  res.status(httpCode).json({
    status: httpCode > 199 && httpCode < 300,
    message: message,
    data: data,
    stack: stack,
  });
};

export {
  exception,
  ServerError,
  NotFound,
  Unauthenticated,
  Forbidden,
  BadRequest,
};
