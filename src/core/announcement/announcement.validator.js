import Joi from 'joi';
import { baseValidator, existInDatabase } from '../../base/validator.base.js';

export const AnnouncementType = {
  SUCCESS: 'success',
  WARNING: 'warning',
  INFO: 'info',
  ERROR: 'error',
};

export const AnnouncementValidator = {
  create: Joi.object({
    candidateIds: Joi.array().items(Joi.string()).optional(),
    candidateQuery: baseValidator.findAllQuery.optional(),
    type: Joi.string()
      .valid(...Object.values(AnnouncementType))
      .required(),
    title: Joi.string().required(),
    desc: Joi.string().allow('').optional(),
  }),
  update: Joi.object({
    candidateIds: Joi.array().items(Joi.string().required()).optional(),
    candidateQuery: baseValidator.findAllQuery.optional(),
    type: Joi.string()
      .valid(...Object.values(AnnouncementType))
      .optional(),
    title: Joi.string().optional(),
    desc: Joi.string().allow('').optional(),
  }),
};

export default AnnouncementValidator;
