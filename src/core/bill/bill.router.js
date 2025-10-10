import { Router } from 'express';
import validatorMiddleware from '../../middlewares/validator.middleware.js';
import BillController from './bill.controller.js';
import BillValidator from './bill.validator.js';
import { baseValidator } from '../../base/validator.base.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const r = Router(),
  validator = BillValidator,
  controller = new BillController();

r.get(
  '/find-all',
  authMiddleware(),
  validatorMiddleware({ query: baseValidator.findAllQuery }),
  controller.findAll
);

r.get('/find-one/:id', authMiddleware(), controller.findById);

r.post(
  '/create',
  authMiddleware(['ADM']),
  validatorMiddleware({ body: validator.create }),
  controller.create
);

r.patch(
  '/update/:id',
  authMiddleware(['ADM']),
  validatorMiddleware({ body: validator.update }),
  controller.update
);

r.delete('/delete/:id', authMiddleware(['ADM']), controller.delete);

const billRouter = r;
export default billRouter;
