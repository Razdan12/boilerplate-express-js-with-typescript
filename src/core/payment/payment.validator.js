import Joi from 'joi';
import { existInDatabase } from '../../base/validator.base.js';

export const PaymentStatus = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
};

export const PaymentMethod = {
  MANUAL_TRANSFER: 'manual_transfer',
};

export const PaymentValidator = {
  create: Joi.object({
    billIds: Joi.array()
      .items(Joi.string().external(existInDatabase('bill')).required())
      .min(1)
      .required(),
    method: Joi.string()
      .valid(...Object.values(PaymentMethod))
      .required(),
  }),
  update: Joi.object({
    title: Joi.string().optional(),
    status: Joi.string()
      .valid(...Object.values(PaymentStatus))
      .optional(),
    expireDate: Joi.date().optional(),
  }),
};

export default PaymentValidator;
