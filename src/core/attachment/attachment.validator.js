import Joi from 'joi';
import { existInDatabase } from '../../base/validator.base.js';

export const AttachmentValidator = {
  create: Joi.object({
    candidateId: Joi.string().external(existInDatabase('candidate')).required(),
    scheduleId: Joi.string().external(existInDatabase('schedule')).optional(),
    title: Joi.string().max(50).required(),
    remark: Joi.string().max(100).optional(),
  }),
};

export default AttachmentValidator;
