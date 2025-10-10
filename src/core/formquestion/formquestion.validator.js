import Joi from 'joi';

export const FormQuestionType = {
  TEXT: 'text',
  TEXTAREA: 'textarea',
  BOOL: 'bool',
  NUMBER: 'number',
  DATE: 'date',
  CHECK: 'check',
  RADIO: 'radio',
  SELECT: 'select',
  FILE: 'file',
  ORDER: 'order',
  REGION: 'region',
};

export const FormQuestionValidator = {
  create: Joi.object({
    // no-data
  }),
  update: Joi.object({
    // no-data
  }),
};

export default FormQuestionValidator;
