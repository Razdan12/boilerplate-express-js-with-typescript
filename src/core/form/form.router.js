import { Router } from 'express';
import validatorMiddleware from '../../middlewares/validator.middleware.js';
import FormController from './form.controller.js';
import FormValidator from './form.validator.js';
import { baseValidator } from '../../base/validator.base.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const r = Router(),
  validator = FormValidator,
  controller = new FormController();

r.get(
  '/find-all',
  authMiddleware(),
  validatorMiddleware({ query: baseValidator.findAllQuery }),
  controller.findAll
);

r.get('/find-one/:id', authMiddleware(), controller.findById);

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

const formRouter = r;
export default formRouter;
