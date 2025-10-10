import Joi from 'joi';

export const FormPageView = {
  LIST: 'list',
  TABLE: 'table',
  VARIANTS: 'variants',
};

export const FormPageValidator = {
  create: Joi.object({
    // no-data
  }),
  update: Joi.object({
    // no-data
  }),
};

export default FormPageValidator;
