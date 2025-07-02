import httpStatus from 'http-status';
import fs from 'fs';
import errorHandler from '../exceptions/handler.exception';
import { Request, Response, NextFunction } from 'express';

// Assuming you have a RoleCode enum somewhere
enum RoleCode {
  ADMIN = 'ADMIN',
  // Add other role codes as needed
}

interface FileObject {
  [key: string]: any;
}

interface PaginatedData {
  items: any[];
  [key: string]: any;
}

class BaseController {
  constructor() {}

  ok = (res: Response, data: any = null, message: string = ''): Response => {
    return res.status(httpStatus.OK).json({
      status: true,
      message: message || 'Sukses',
      data,
    });
  };

  created = (res: Response, data: any = null, message: string = ''): Response => {
    return res.status(httpStatus.CREATED).json({
      status: true,
      message: message || 'Data baru berhasil dibuat',
      data,
    });
  };

  noContent = (res: Response, message: string = ''): Response => {
    return res.status(httpStatus.NO_CONTENT).json({
      status: true,
      message: message || 'Data berhasil dihapus',
    });
  };

  BadRequest = (res: Response, message: string = ''): Response => {
    return res.status(httpStatus.BAD_REQUEST).json({
      status: false,
      message: message || 'Permintaan tidak valid',
    });
  };

  checkFilesObj = (files: FileObject, keys: string[]): void => {
    let message: string | null = null;

    for (const key of keys) {
      if (!Object.prototype.hasOwnProperty.call(files, key)) {
        let name = key;
        if (key.includes('_')) {
          name = key.substring(key.indexOf('_') + 1);
        }
        message = 'Mohon sertakan ' + name;
        break;
      }
    }

    if (message) throw new Error(message); // Or use your custom BadRequest error
  };

  wrapper = (method: Function) => {
    return async (req: Request, res: Response, ...args: any[]) => {
      try {
        return await method.apply(this, [req, res, ...args]);
      } catch (err) {
        return errorHandler(err, req, res, () => {});
      }
    };
  };

  joinBrowseQuery = (query: Record<string, string>, field: string, colval: string): Record<string, string> => {
    query[field] = query[field] ? `${query[field]}+${colval}` : colval;
    return query;
  };

  exclude = (data: any | any[] | PaginatedData, selects: string[], isPaginate: boolean = false): any => {
    if (isPaginate) {
      const paginatedData = data as PaginatedData;
      paginatedData.items = paginatedData.items.map((dat) =>
        Object.fromEntries(
          Object.entries(dat).filter(([key]) => !selects.includes(key))
        )
      );
      return paginatedData;
    }

    return Array.isArray(data)
      ? data.map((d) =>
          Object.fromEntries(
            Object.entries(d).filter(([key]) => !selects.includes(key))
          )
        )
      : Object.fromEntries(
          Object.entries(data).filter(([key]) => !selects.includes(key))
        );
  };

  include = (data: any | any[] | PaginatedData, selects: string[] = [], isPaginate: boolean = false): any => {
    if (isPaginate) {
      const paginatedData = data as PaginatedData;
      paginatedData.items = paginatedData.items.map((dat) =>
        Object.fromEntries(
          Object.entries(dat).filter(([key]) => selects.includes(key))
        )
      );
      return paginatedData;
    }

    return Array.isArray(data)
      ? data.map((d) =>
          Object.fromEntries(
            Object.entries(d).filter(([key]) => selects.includes(key))
          )
        )
      : Object.fromEntries(
          Object.entries(data).filter(([key]) => selects.includes(key))
        );
  };
}

export default BaseController;