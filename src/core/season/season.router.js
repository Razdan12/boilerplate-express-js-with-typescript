import { Router } from 'express';
import validatorMiddleware from '../../middlewares/validator.middleware.js';
import SeasonController from './season.controller.js';
import SeasonValidator from './season.validator.js';
import { baseValidator } from '../../base/validator.base.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const r = Router(),
  validator = SeasonValidator,
  controller = new SeasonController();

r.get(
  '/find-all',
  authMiddleware(),
  validatorMiddleware({ query: baseValidator.findAllQuery }),
  controller.findAll
);

r.get('/find-one/:id', controller.findById);

r.post(
  '/create',
  authMiddleware(['ADM', 'SDM']),
  validatorMiddleware({ body: validator.create }),
  controller.create
);

r.patch(
  '/update/:id',
  authMiddleware(['ADM', 'SDM']),
  validatorMiddleware({ body: validator.update }),
  controller.update
);

r.delete('/delete/:id', authMiddleware(['ADM', 'SDM']), controller.delete);

const seasonRouter = r;
export default seasonRouter;
