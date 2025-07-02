import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import fs from 'fs';
import { env } from 'process';

declare module 'express' {
  interface Request {
    file?: Express.Multer.File;
    files?: {
      [fieldname: string]: Express.Multer.File[];
    } | Express.Multer.File[];
  }
}

class HttpError extends Error {
  public http_code: number;

  constructor(message: string = 'Kesalahan http tidak tertangani') {
    super(message);
    this.name = this.constructor.name;
    this.http_code = httpStatus.INTERNAL_SERVER_ERROR;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFound extends HttpError {
  constructor(message: string = 'Data tidak ditemukan') {
    super(message);
    this.http_code = httpStatus.NOT_FOUND;
  }
}

class Unauthenticated extends HttpError {
  constructor(message: string = 'Harap authenticate') {
    super(message);
    this.http_code = httpStatus.UNAUTHORIZED;
  }
}

class BadRequest extends HttpError {
  constructor(message: string = 'Permintaan tidak dapat diproses') {
    super(message);
    this.http_code = httpStatus.BAD_REQUEST;
  }
}

class Forbidden extends HttpError {
  constructor(message: string = 'Anda tidak memiliki akses') {
    super(message);
    this.http_code = httpStatus.FORBIDDEN;
  }
}

class ServerError extends HttpError {
  constructor(message: string = 'Kesalahan server') {
    super(message);
    this.http_code = httpStatus.INTERNAL_SERVER_ERROR;
  }
}

interface ValidationErrorDetail {
  message: string;
  path?: string[];
  type?: string;
  context?: any;
}

type GenericError = Error & {
  http_code?: number;
  code?: string;
  details?: ValidationErrorDetail[];
};

const catchResponse = (err: GenericError, req: Request, res: Response) => {
  let httpCode: number = err.http_code || 500;
  let message: string = err.message || 'Kesalahan server';
  let data: string[] | undefined = undefined;
  let stack: string[] | undefined = env.NODE_ENV === 'development' ? err?.stack?.split('\n') : undefined;

  if (env.NODE_ENV === 'development') {
    console.error(err);
  }

  if (err.code === 'P2003') {
    httpCode = httpStatus.UNPROCESSABLE_ENTITY;
    message = 'Tidak dapat mengubah data karena terkait dengan data lain';
  }
  else if (err.name === 'PrismaClientValidationError') {
    httpCode = httpStatus.BAD_REQUEST;
    if (err.message.includes('Unknown argument')) {
      const part = err.message.match(/Unknown argument `[^`]+`/);
      message = part ? part[0] : 'Unknown argument on request';
    } else if (err.message.includes('Unknown field')) {
      const part = err.message.match(
        /Unknown field `[^`]+` for select statement/
      );
      message = part ? part[0] : 'Unknown field name on request';
    }
  }
  else if (err.name === 'PrismaClientKnownRequestError' && err.code === 'P2025') {
    httpCode = httpStatus.NOT_FOUND;
    message = 'Data tidak ditemukan';
  }
  else if (err.name === 'ValidationError' && err.details) {
    httpCode = httpStatus.UNPROCESSABLE_ENTITY;
    message = 'Validasi permintaan gagal';
    data = err.details.map((det: ValidationErrorDetail) => det.message);
  }
  else if (err instanceof HttpError) {
    httpCode = err.http_code;
    message = err.message;
  }
  else {
    console.error('Unhandled error:', err);
  }

  const uploaded: Express.Multer.File[] = [];

  if (req.file) {
    uploaded.push(req.file);
  }
  if (req.files) {
    if (Array.isArray(req.files)) {
      req.files.forEach((file) => uploaded.push(file));
    } else if (typeof req.files === 'object') {
      Object.keys(req.files).forEach((field) => {
        (req.files as { [fieldname: string]: Express.Multer.File[] })[field].forEach((file) => {
          uploaded.push(file);
        });
      });
    }
  }

  if (uploaded.length > 0) {
    uploaded.forEach((up) => {
      fs.unlink(up.path, (unlinkErr) => {
        if (unlinkErr) {
          console.error('ERR(file deletion): ', unlinkErr);
        } else {
          console.log(`Deleted file: ${up.path}`);
        }
      });
    });
  }

  res.status(httpCode).json({
    status: httpCode >= 200 && httpCode < 300,
    message: message,
    data: data,
    stack: stack,
  });
};

export {
  catchResponse,
  ServerError,
  NotFound,
  Unauthenticated,
  Forbidden,
  BadRequest,
  HttpError
};
