import Joi from 'joi';
import {
  CandidateEduLevel,
  CandidateStudentType,
} from '../candidate/candidate.validator.js';

export const PaymentRefType = {
  INITIAL_PAYMENT: 'Initial payment',
  FULL_PAYMENT: 'Full payment',
  DISCOUNT: 'Diskon',
};

export const PaymentRefValidator = {
  create: Joi.object({
    type: Joi.string()
      .valid(...Object.values(PaymentRefType))
      .required(),
    title: Joi.string().required(),
    eduLevel: Joi.string()
      .valid(...Object.values(CandidateEduLevel))
      .optional(),
    studentType: Joi.string()
      .valid(...Object.values(CandidateStudentType))
      .optional(),
    amount: Joi.number().required(),
  }),
  update: Joi.object({
    type: Joi.string()
      .valid(...Object.values(PaymentRefType))
      .optional(),
    title: Joi.string().optional(),
    eduLevel: Joi.string()
      .valid(...Object.values(CandidateEduLevel))
      .optional(),
    studentType: Joi.string()
      .valid(...Object.values(CandidateStudentType))
      .optional(),
    amount: Joi.number().optional(),
  }),
};

export default PaymentRefValidator;
