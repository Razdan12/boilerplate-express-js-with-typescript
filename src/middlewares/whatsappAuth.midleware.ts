import httpStatus from 'http-status-codes';
import { ApiError, Unauthenticated } from '../exceptions/errors.exception';
import { verifyToken } from '../helpers/jwt.helper';
import prisma from '../config/prisma.db';
import { Request, Response, NextFunction } from 'express';
import { User } from '@prisma/client';

interface AuthenticatedRequest extends Request {
  user?: User;
}

export default function authWa(roles?: string[]) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return next(
          new ApiError(
            httpStatus.StatusCodes.UNAUTHORIZED,
            'NO_AUTHORIZATION',
            'Please authenticate with JWT token'
          )
        );
      }
      
      const [bearer, token] = authHeader.split(' ');
      if (bearer !== 'Bearer' || !token) {
        return next(
          new ApiError(
            httpStatus.StatusCodes.UNAUTHORIZED,
            'NO_AUTHORIZATION',
            'Please authenticate with JWT token'
          )
        );
      }
      
      let decoded: any;
      try {
        decoded = verifyToken(token);
      } catch (e) {
        throw new Unauthenticated();
      }
      
      const apiToken = req.headers['x-api-key'];
      if (!apiToken || typeof apiToken !== 'string') {
        return next(
          new ApiError(
            httpStatus.StatusCodes.UNAUTHORIZED,
            'NO_AUTHORIZATION',
            'Please provide API token'
          )
        );
      }
      
      const user = await prisma.user.findUnique({
        where: { apiToken },
      });
      
      if (!user) {
        return next(
          new ApiError(
            httpStatus.StatusCodes.UNAUTHORIZED,
            'NO_DATA',
            'Invalid API token'
          )
        );
      }
    
      if (decoded.id && user.id !== decoded.id) {
        return next(
          new ApiError(
            httpStatus.StatusCodes.UNAUTHORIZED,
            'NO_DATA',
            'JWT token does not match API token'
          )
        );
      }
      
      req.user = user;
      next();
    } catch (e: any) {
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
