import multer from 'multer';
import fs from 'fs';
import { BadRequest } from '../exceptions/errors.exception';
import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  user?: { id: number };
  files?: { [fieldname: string]: Express.Multer.File[] | undefined };
}

interface UploadField {
  name: string;
  mimeTypes: (
    'image/jpeg' |
    'image/jpg' |
    'image/png' |
    'video/mp4' |
    'video/webm' |
    'application/pdf' |
    'application/msword
  )[];
  maxCount?: number;
  limitSize?: number;
}

/**
 * @param {'./uploads' | './public'} basePath
 * @param {string} subPaths
 * @returns {multer.StorageEngine}
 */
const createStorage = (basePath: string, subPaths: string): multer.StorageEngine => {
  return multer.diskStorage({
    destination: function (req: AuthenticatedRequest, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
      const fullPath = basePath + subPaths;
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
      cb(null, fullPath);
    },
    filename: function (req: AuthenticatedRequest, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
      const fileName = `${Date.now()}-${file.fieldname}-${req.user?.id ?? 'null'}-${file.originalname}`;
      cb(null, fileName);
    },
  });
};

/**
 * @param {'./uploads' | './public'} basePath
 * @param {string} subPaths
 * @param {UploadField[]} fields
 */
const uploadMany =
  (basePath: './uploads' | './public' = './public', subPaths: string, fields: UploadField[]) =>
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const upload = multer({
      storage: createStorage(basePath, subPaths),
    }).fields(fields.map(({ name, maxCount }) => ({ name, maxCount })));

    upload(req, res, (err: any) => {
      if (err) return next(new BadRequest(err.message ?? 'Gagal mengunggah'));

      for (const field of fields) {
        const files = req.files?.[field.name];
        if (files) {
          for (const file of files) {
            // default 2mb
            if (file.size > (field.limitSize ?? 2000000))
              return next(
                new BadRequest(`Ukuran ${field.name} melebihi batas.`)
              );

            if (!field.mimeTypes.includes(file.mimetype as any))
              return next(new BadRequest(`Format ${field.name} tidak sesuai.`));
          }
        }
      }

      next();
    });
  };

export { uploadMany };
