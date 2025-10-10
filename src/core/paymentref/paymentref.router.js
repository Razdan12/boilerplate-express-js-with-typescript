import { Router } from 'express';
import validatorMiddleware from '../../middlewares/validator.middleware.js';
import PaymentRefController from './paymentref.controller.js';
import PaymentRefValidator from './paymentref.validator.js';
import { baseValidator } from '../../base/validator.base.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const r = Router(),
  validator = PaymentRefValidator,
  controller = new PaymentRefController();

r.get(
  '/find-all',
  authMiddleware(['ADM', 'SDM']),
  validatorMiddleware({ query: baseValidator.findAllQuery }),
  controller.findAll
);

r.get('/find-one/:id', authMiddleware(['ADM', 'SDM']), controller.findById);

r.post(
  '/create',
  authMiddleware(['SDM']),
  validatorMiddleware({ body: validator.create }),
  controller.create
);

r.patch(
  '/update/:id',
  authMiddleware(['SDM']),
  validatorMiddleware({ body: validator.update }),
  controller.update
);

r.delete('/delete/:id', authMiddleware(['SDM']), controller.delete);

const paymentrefRouter = r;
export default paymentrefRouter;
