import Joi from 'joi';

export const FormResponseStatus = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
};

export const FormResponseValidator = {
  create: Joi.object({
    // no-data
  }),
  update: Joi.object({
    status: Joi.string()
      .valid(...Object.values(FormResponseStatus))
      .default(FormResponseStatus.DRAFT)
      .optional(),
    answers: Joi.array()
      .items(
        Joi.object({
          questionId: Joi.string().required(),
          variant: Joi.string().allow('').optional(),
          subVariant: Joi.string().allow('').optional(),
          ansDate: Joi.date().allow('').optional(),
          ansBool: Joi.bool().allow('').optional(),
          ansText: Joi.string().allow('').optional(),
          ansNumber: Joi.number().allow('').optional(),
        })
      )
      .min(1)
      .required(),
  }),
};

export default FormResponseValidator;
