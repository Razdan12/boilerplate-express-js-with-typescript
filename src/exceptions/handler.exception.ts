import httpStatus from 'http-status-codes';
import {
  ValidationError,
  UnauthorizedError,
  ApiError,
} from './errors.exception';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import fs from 'fs';
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

interface UploadedFile {
  path: string;
  [key: string]: any;
}

interface ErrorResponse {
  errors: {
    status: number;
    data: null;
    error: {
      code: string;
      message: string;
      trace?: string[];
    };
  };
}

interface CustomRequest extends Request {
  file?: UploadedFile;
  files?: UploadedFile[] | { [fieldname: string]: UploadedFile[] };
}

const APP_DEBUG = process.env.APP_DEBUG === 'true';

const errorHandler: ErrorRequestHandler = (
  err: any,
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  // Hapus file yang diupload (jika ada) untuk efisiensi penyimpanan
  if (err) {
    const uploaded: UploadedFile[] = [];

    if (req.file) uploaded.push(req.file);
    if (req.files) {
      if (typeof req.files === 'object' && !Array.isArray(req.files)) {
        Object.keys(req.files).forEach((field) => {
          const files = req.files as { [fieldname: string]: UploadedFile[] };
          files[field].forEach((file) => {
            uploaded.push(file);
          });
        });
      } else if (Array.isArray(req.files)) {
        req.files.forEach((file) => uploaded.push(file));
      }
    }

    if (uploaded.length) {
      uploaded.forEach((up) => {
        fs.unlink(up.path, (unlinkErr) => {
          if (unlinkErr) {
            console.error('ERR(file): ', unlinkErr);
          }
        });
      });
    }
  }

  if (res.headersSent) {
    return next(err);
  }

  // Handle specific errors
  if (err instanceof ValidationError) {
    res.status(httpStatus.BAD_REQUEST).json({
      errors: {
        status: httpStatus.BAD_REQUEST,
        data: null,
        error: {
          code: err.name,
          message: err.validationMessage,
        },
      },
    });
    return;
  }

  if (err instanceof PrismaClientKnownRequestError) {
    res.status(httpStatus.BAD_REQUEST).json({
      errors: {
        status: httpStatus.BAD_REQUEST,
        data: null,
        error: {
          code: err.name,
          message: err?.meta?.target ? err.meta.target.toString() : err.message,
        },
      },
    });
    return;
  }

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      errors: {
        status: err.statusCode,
        data: null,
        error: {
          code: err.name,
          message: err.message,
        },
      },
    });
    return;
  }

  // Default error handling
  const statusCode =
    err.http_code ||
    err.statusCode ||
    httpStatus.INTERNAL_SERVER_ERROR ||
    500;
  
  res.status(statusCode).json({
    errors: {
      status: statusCode,
      data: null,
      error: {
        code: err.name || 'Error',
        message: err.message || 'An unknown error occurred',
        trace:
          APP_DEBUG && statusCode !== httpStatus.NOT_FOUND && err.stack
            ? err.stack.split('\n')
            : undefined,
      },
    },
  });
};

export default errorHandler;