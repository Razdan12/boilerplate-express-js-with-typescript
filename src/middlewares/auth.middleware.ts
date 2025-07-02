import httpStatus from 'http-status-codes';
import { ApiError } from '../exceptions/errors.exception';
import { verifyToken } from '../helpers/jwt.helper';
import { Unauthenticated } from '../exceptions/errors.exception';
import prisma from '../config/prisma.db';
import { Request, Response, NextFunction } from 'express';
import { User } from '@prisma/client';

interface AuthenticatedRequest extends Request {
  user?: User;
}

export default function auth(roles?: string[]) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return next(
          new ApiError(
            httpStatus.StatusCodes.UNAUTHORIZED,
            'NO_AUTHORIZATION',
            'Please Authenticate'
          )
        );
      }

      const parts = authHeader.split(' ');
      const token = parts[1];
      if (!token) {
        return next(
          new ApiError(
            httpStatus.StatusCodes.UNAUTHORIZED,
            'NO_AUTHORIZATION',
            'Please Authenticate'
          )
        );
      }

      let decoded: any;
      try {
        decoded = verifyToken(token);
      } catch (e) {
        return next(new Unauthenticated('Invalid or expired token'));
      }

      const user = await prisma.user.findFirst({
        where: { id: decoded.userId },
      });

      if (!user) {
        return next(
          new ApiError(
            httpStatus.StatusCodes.UNAUTHORIZED,
            'NO_DATA',
            'Please Authenticate'
          )
        );
      }

      if (roles && roles.length > 0) {
        const userRoleCodes = user.role;
        const hasAccess = roles.some(allowedRole => userRoleCodes.includes(allowedRole));
        if (!hasAccess) {
          return next(
            new ApiError(
              httpStatus.StatusCodes.FORBIDDEN,
              'NO_ACCESS',
              'Unauthorized'
            )
          );
        }
      }

      req.user = user;
      next();
    } catch (e: any) {
      console.log('ini error auth middleware', e);

      if (e.message === 'jwt expired') {
        return next(
          new ApiError(
            httpStatus.StatusCodes.UNAUTHORIZED,
            'NO_ACCESS',
            'Expired Login Session'
          )
        );
      }
      console.error(e);
      return next(e);
    }
  };
}
