import Joi from 'joi';
import { existInDatabase } from '../../base/validator.base.js';

export const ScheduleValidator = {
  create: Joi.object({
    title: Joi.string().required(),
    candidateId: Joi.string().external(existInDatabase('candidate')).required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().greater(Joi.ref('startDate')).required(),
    remark: Joi.string().max(230).optional(),
  }),
  update: Joi.object({
    title: Joi.string().optional(),
    candidateId: Joi.string().external(existInDatabase('candidate')).optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().greater(Joi.ref('startDate')).optional(),
    remark: Joi.string().max(230).optional(),
  }),
};

export default ScheduleValidator;
