import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { catchResponse } from '../exceptions/catch.execption';

interface ValidationSchemas {
  body?: Joi.ObjectSchema<any>;
  query?: Joi.ObjectSchema<any>;
}

/**
 * @param {ValidationSchemas} schemas
 */
const validatorMiddleware = ({ body, query }: ValidationSchemas) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const options = {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    };

    try {
      // Validasi req.body
      const bodyValue = body
        ? await body.validateAsync(req.body, options)
        : req.body;

      // Validasi req.query
      const queryValue = query
        ? await query.validateAsync(req.query, options)
        : req.query;

      req.body = bodyValue;
      req.query = queryValue;
      next();
    } catch (err: any) {
      return catchResponse(err, req, res);
    }
  };
};

export default validatorMiddleware;
