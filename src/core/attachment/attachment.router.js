import { Router } from 'express';
import validatorMiddleware from '../../middlewares/validator.middleware.js';
import AttachmentController from './attachment.controller.js';
import AttachmentValidator from './attachment.validator.js';
import { baseValidator } from '../../base/validator.base.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { upload } from '../../middlewares/upload.middleware.js';
import { mbToBytes } from '../../utils/number.js';

const r = Router(),
  validator = AttachmentValidator,
  controller = new AttachmentController();

r.get('/download-file/:id', authMiddleware(), controller.downloadFile);

r.get(
  '/find-all',
  authMiddleware(),
  validatorMiddleware({ query: baseValidator.findAllQuery }),
  controller.findAll
);

r.get('/find-one/:id', authMiddleware(), controller.findById);

r.post(
  '/create',
  authMiddleware(['ADM', 'PSI']),
  upload({
    maxBytes: mbToBytes(3),
    mimeTypes: ['application/pdf'],
  }).single('file'),
  validatorMiddleware({ body: validator.create }),
  controller.create
);

r.delete('/delete/:id', authMiddleware(['ADM', 'PSI']), controller.delete);

const attachmentRouter = r;
export default attachmentRouter;
