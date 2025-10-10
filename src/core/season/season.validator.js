import Joi from 'joi';

export const SeasonValidator = {
  create: Joi.object({
    title: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().greater(Joi.ref('startDate')).required(),
  }),
  update: Joi.object({
    title: Joi.string().optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().greater(Joi.ref('startDate')).optional(),
    isActive: Joi.bool().optional(),
  }),
};

export default SeasonValidator;
