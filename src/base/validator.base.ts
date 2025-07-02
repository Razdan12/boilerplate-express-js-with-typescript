import Joi from 'joi';
import prisma from '../config/prisma.db';

// Helper type for Joi custom validation functions
type JoiCustomValidator<T = any> = (value: T, helpers: Joi.CustomHelpers) => T | Joi.ErrorReport | Promise<T | Joi.ErrorReport>;

const containColon: JoiCustomValidator<string> = (value, helpers) => {
  for (const el of value.split('+')) {
    if (!el.includes(':')) {
      return helpers.message({ custom: 'Query must contain ":" to separate field and value' });
    }
  }
  return value;
};

const orderPattern: JoiCustomValidator<string> = (value, helpers) => {
  for (const el of value.split('+')) {
    if (!el.includes(':')) {
      return helpers.message({ custom: 'Query must contain ":" to separate field and value' });
    }
    const val = el.split(':')[1];
    if (val !== 'desc' && val !== 'asc') {
      return helpers.message({ custom: 'Order query value must be "desc" or "asc"' });
    }
  }
  return value;
};

export const isTimeString: JoiCustomValidator<string> = (value, helpers) => {
  const pattern = /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/; // Updated to make seconds optional
  if (!pattern.test(value)) {
    return helpers.message({ custom: 'Time string must be in the format HH:mm or HH:mm:ss' });
  }
  return value;
};

/**
 * Creates a validator to check if a relation exists in the specified table
 * @param table The Prisma model name
 */
export const relationExist = (table: string): JoiCustomValidator<string | number> => {
  return async (value, helpers) => {
    if (value === undefined) return value;

    try {
      const found = await (prisma[table as keyof typeof prisma] as any).count({
        where: { id: value },
      });
      if (found === 0) {
        const fieldName = helpers.state.path?.join('.');
        return helpers.message({
          custom: `The ${fieldName} with ID ${value} does not exist`,
        });
      }
      return value;
    } catch (err) {
      return helpers.message({ custom: (err as Error).message });
    }
  };
};

interface BrowseQuerySchema {
  search?: string;
  starts?: string;
  where?: string;
  in_?: string;
  not_?: string;
  isnull?: string;
  gte?: string;
  lte?: string;
  paginate?: boolean;
  limit?: number;
  page?: number;
  order?: string;
}

export const baseValidator = {
  browseQuery: Joi.object<BrowseQuerySchema>({
    search: Joi.string().optional().custom(containColon),
    starts: Joi.string().optional().custom(containColon),
    where: Joi.string().optional().custom(containColon),
    in_: Joi.string().optional().custom(containColon),
    not_: Joi.string().optional().custom(containColon),
    isnull: Joi.string().optional(),
    gte: Joi.string().optional().custom(containColon),
    lte: Joi.string().optional().custom(containColon),
    paginate: Joi.boolean().optional().default(true),
    limit: Joi.number().optional().default(10),
    page: Joi.number().optional().default(1),
    order: Joi.string().optional().custom(orderPattern),
  }),
};