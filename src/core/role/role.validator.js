import Joi from 'joi';

export const RoleValidator = {
  create: Joi.object({
    code: Joi.string().uppercase().required(),
    name: Joi.string().required(),
  }),
  update: Joi.object({
    code: Joi.string().uppercase().optional(),
    name: Joi.string().optional(),
    isActive: Joi.bool().optional(),
  }),
};

export default RoleValidator;
