import jwt from 'jsonwebtoken';
import {
  exception,
  Forbidden,
  Unauthenticated,
} from './exception.middleware.js';
import { prisma } from '../db/prisma.js';

/**
 * @param {("SDM" | "ADM" | "USR" | "KSK" | "PSI")[] | null} roleCodes
 */
const authMiddleware = (roleCodes = null) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        throw new Unauthenticated();
      }

      let data;
      try {
        data = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      } catch (err) {
        throw new Unauthenticated();
      }

      // TODO: replace with redis
      const user = await prisma.user.findUnique({
        where: { id: data.uid },
        select: {
          id: true,
          fullName: true,
          email: true,
          isActive: true,
          roles: {
            select: {
              id: true,
              isActive: true,
              role: {
                select: { code: true, isActive: true },
              },
            },
          },
        },
      });
      if (!user) throw new Unauthenticated();
      if (!user.isActive) throw new Unauthenticated('Account suspended');

      const activeRole = user.roles.find(
        (ur) => ur.isActive && ur.role.isActive
      );

      if (roleCodes && !roleCodes.includes(activeRole.role.code)) {
        throw new Forbidden();
      }

      req.user = {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        roleCode: activeRole?.role?.code ?? null,
      };

      next();
    } catch (error) {
      exception(error, req, res);
    }
  };
};

export { authMiddleware };
