import fs from 'fs';
import { isBoolean, isDateAble, isInteger } from '../utils/type';
import { PrismaClient } from '@prisma/client';
import moment from 'moment';

interface QueryParams {
  where?: string;
  starts?: string;
  search?: string;
  in_?: string;
  not_?: string;
  isnull?: string;
  gte?: string;
  lte?: string;
  order?: string;
  limit?: number;
  page?: number;
  paginate?: boolean;
  [key: string]: any;
}

interface PaginatedResult<T> {
  total_items: number;
  page: number;
  limit: number;
  total_pages: number;
  items: T[];
}

interface WhereCondition {
  [key: string]: any;
}

class BaseService {
  protected db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  transformBrowseQuery(query: QueryParams = {}): {
    where: { AND: WhereCondition[] };
    take?: number;
    skip?: number;
    orderBy?: Record<string, 'asc' | 'desc'>;
  } {
    // where
    const wheres: WhereCondition = {};
    if (query?.where) {
      query.where.split('|').forEach((q) => {
        const [col, val] = q.split(':');

        if (val === '') return;

        let parsedVal: any = val;
        if (isInteger(val)) {
          parsedVal = parseInt(val);
        } else if (isBoolean(val)) {
          parsedVal = val === 'true';
        }

        const keys = col.split('.');
        let current = wheres;

        keys.forEach((key, index) => {
          if (index === keys.length - 1) {
            current[key] = parsedVal;
          } else {
            current[key] = current[key] || {};
            current = current[key];
          }
        });
      });
    }

    // starts
    const starts: WhereCondition = {};
    if (query?.starts) {
      const ors: WhereCondition[] = [];
      query.starts.split('|').forEach((q) => {
        const [col, val] = q.split(':');
        const keys = col.split('.');
        let current: WhereCondition = {};
        let temp = current;

        keys.forEach((key, index) => {
          if (index === keys.length - 1) {
            temp[key] = {
              startsWith: val,
            };
          } else {
            temp[key] = {};
            temp = temp[key];
          }
        });

        ors.push(current);
      });

      starts.OR = ors;
    }

    // search
    const search: WhereCondition = {};
    if (query?.search) {
      const ors: WhereCondition[] = [];
      query.search.split('|').forEach((q) => {
        const [col, val] = q.split(':');
        const keys = col.split('.');
        let current: WhereCondition = {};
        let temp = current;

        keys.forEach((key, index) => {
          if (index === keys.length - 1) {
            temp[key] = {
              contains: val,
            };
          } else {
            temp[key] = {};
            temp = temp[key];
          }
        });

        ors.push(current);
      });

      search.OR = ors;
    }

    // in
    const in_: WhereCondition = {};
    if (query?.in_) {
      query.in_.split('|').forEach((q) => {
        const [col, val] = q.split(':');
        const keys = col.split('.');
        let current = in_;

        keys.forEach((key, index) => {
          if (index === keys.length - 1) {
            const vals = val.split(',').map((v) => {
              if (isInteger(v)) {
                return parseInt(v);
              } else if (isBoolean(v)) {
                return v === 'true';
              }
              return v;
            });

            if (keys[keys.length - 2]?.endsWith('s')) {
              current.some = {
                [key]: {
                  in: vals,
                },
              };
            } else {
              current[key] = {
                in: vals,
              };
            }
          } else {
            current[key] = current[key] || {};
            current = current[key];
          }
        });
      });
    }

    // is not
    const not_: WhereCondition = {};
    if (query?.not_) {
      const ors: WhereCondition[] = [];
      query.not_.split('|').forEach((q) => {
        const [col, val] = q.split(':');
        const keys = col.split('.');
        let current: WhereCondition = {};
        let temp = current;

        keys.forEach((key, index) => {
          if (index === keys.length - 1) {
            temp[key] = {
              not: val,
            };
          } else {
            temp[key] = {};
            temp = temp[key];
          }
        });

        ors.push(current);
      });

      not_.OR = ors;
    }

    // is null
    const isnull: WhereCondition = {};
    if (query?.isnull) {
      query.isnull.split('|').forEach((q) => {
        isnull[q] = null;
      });
    }

    // gte
    const gte: WhereCondition = {};
    if (query?.gte) {
      query.gte.split('|').forEach((q) => {
        const [col, val] = q.split(':');
        gte[col] = {
          gte: isDateAble(val) ? moment(val).toDate() : val,
        };
      });
    }

    // lte
    const lte: WhereCondition = {};
    if (query?.lte) {
      query.lte.split('|').forEach((q) => {
        const [col, val] = q.split(':');
        lte[col] = {
          lte: isDateAble(val) ? moment(val).endOf('day').toDate() : val,
        };
      });
    }

    // order by
    const orderBy: Record<string, 'asc' | 'desc'> = {};
    if (query?.order) {
      query.order.split('|').forEach((q) => {
        const [col, val] = q.split(':');
        orderBy[col] = val as 'asc' | 'desc';
      });
    }

    // pagination
    const pagination: { take?: number; skip?: number } = {};

    if (query?.limit && query.limit > 0) {
      if (query.paginate) pagination.take = query.limit;
    }

    if (query?.paginate) {
      if (pagination.take && pagination.take > 0) {
        const page = query.page && query.page > 0 ? query.page : 1;
        pagination.skip = (page - 1) * (pagination.take || 0);
      }
    }

    return {
      where: {
        AND: [wheres, search, starts, in_, not_, isnull, gte, lte],
      },
      take: pagination.take,
      skip: pagination.skip,
      orderBy: Object.keys(orderBy).length > 0 ? orderBy : undefined,
    };
  }

  paginate<T>(data: T[], count: number, query: { take: number; skip: number }): PaginatedResult<T> {
    const size = query.take <= 0 ? count : query.take;
    const page = query.skip >= 0 ? Math.floor(query.skip / query.take) + 1 : 1;

    return {
      total_items: count,
      page,
      limit: size,
      total_pages: Math.ceil(count / size) || 1,
      items: data,
    };
  }

  exclude<T extends Record<string, any>>(data: T, selects: string[]): Partial<T> {
    return Object.fromEntries(
      Object.entries(data).filter(([key]) => !selects.includes(key))
    ) as Partial<T>;
  }

  select(selects: string[] = []): Record<string, any> | undefined {
    if (!selects.length) return undefined;

    const select: Record<string, any> = {};

    selects.forEach((key) => {
      const parts = key.split('.');
      let current = select;

      parts.forEach((part, index) => {
        if (!current[part]) {
          if (index === parts.length - 1) {
            current[part] = true;
          } else {
            current[part] = { select: {} };
          }
        } else if (
          index === parts.length - 1 &&
          typeof current[part] === 'object' &&
          !current[part].select
        ) {
          current[part].select = {};
        }
        current = current[part].select || current[part];
      });
    });

    return select;
  }

  deleteUpload(path: string): void {
    fs.unlink(path, (err) => {
      if (err) {
        console.error('ERR(file): ', err);
      }
    });
  }

 getQueryValue(
  query: Record<string, string> = {}, 
  key: string, 
  col: string
): string | Date | number | boolean | undefined {
  if (query[key]) {
    const colvals = query[key].split('+');
    const findMatchCol = colvals.find((cv) => cv.includes(col));
    
    if (findMatchCol) {
      const parts = findMatchCol.split(':');
      if (parts.length < 2) return undefined;
      
      let val = parts[1];

      if (isDateAble(val)) {
        return moment(val).toDate();
      }
      if (isInteger(val)) {
        return parseInt(val);
      }
      if (isBoolean(val)) {
        return val === 'true';
      }
      
      return val;
    }
  }
  return undefined;
}
}

export default BaseService;