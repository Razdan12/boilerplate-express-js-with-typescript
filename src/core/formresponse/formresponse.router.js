import { Router } from 'express';
import validatorMiddleware from '../../middlewares/validator.middleware.js';
import FormResponseController from './formresponse.controller.js';
import FormResponseValidator from './formresponse.validator.js';
import { baseValidator } from '../../base/validator.base.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { upload } from '../../middlewares/upload.middleware.js';
import { mbToBytes } from '../../utils/number.js';

const r = Router(),
  validator = FormResponseValidator,
  controller = new FormResponseController();

r.get('/export/:id', authMiddleware(), controller.export);

r.get(
  '/download-file/:id/:answerId',
  authMiddleware(),
  controller.downloadFile
);

r.get(
  '/find-all',
  authMiddleware(),
  validatorMiddleware({ query: baseValidator.findAllQuery }),
  controller.findAll
);

r.get('/find-one/:id', authMiddleware(), controller.findById);

r.post(
  '/create',
  authMiddleware(),
  validatorMiddleware({ body: validator.create }),
  controller.create
);

r.patch(
  '/update/:id',
  authMiddleware(),
  upload({ maxBytes: mbToBytes(5) }).array('files[]'),
  validatorMiddleware({ body: validator.update }),
  controller.update
);

r.delete('/delete/:id', authMiddleware(), controller.delete);

const formresponseRouter = r;
export default formresponseRouter;
