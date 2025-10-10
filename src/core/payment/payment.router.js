import { Router } from 'express';
import validatorMiddleware from '../../middlewares/validator.middleware.js';
import PaymentController from './payment.controller.js';
import PaymentValidator from './payment.validator.js';
import { baseValidator } from '../../base/validator.base.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { upload } from '../../middlewares/upload.middleware.js';
import { mbToBytes } from '../../utils/number.js';

const r = Router(),
  validator = PaymentValidator,
  controller = new PaymentController();

r.get(
  '/find-all',
  authMiddleware(),
  validatorMiddleware({ query: baseValidator.findAllQuery }),
  controller.findAll
);

r.get('/find-one/:id', authMiddleware(), controller.findById);

r.get('/download-proof/:id', authMiddleware(), controller.downloadProof);

r.post(
  '/create',
  authMiddleware(),
  upload({
    maxBytes: mbToBytes(3),
    mimeTypes: ['image/jpeg', 'image/jpg', 'image/png'],
  }).single('proof'),
  validatorMiddleware({ body: validator.create }),
  controller.create
);

r.patch(
  '/update/:id',
  authMiddleware(['SDM', 'ADM']),
  validatorMiddleware({ body: validator.update }),
  controller.update
);

// r.delete('/delete/:id', authMiddleware(['SDM']), controller.delete);

const paymentRouter = r;
export default paymentRouter;
