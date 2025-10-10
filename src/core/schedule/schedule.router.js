import { Router } from 'express';
import validatorMiddleware from '../../middlewares/validator.middleware.js';
import ScheduleController from './schedule.controller.js';
import ScheduleValidator from './schedule.validator.js';
import { baseValidator } from '../../base/validator.base.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const r = Router(),
  validator = ScheduleValidator,
  controller = new ScheduleController();

r.get(
  '/find-all',
  authMiddleware(['ADM', 'KSK', 'PSI', 'USR']),
  validatorMiddleware({ query: baseValidator.findAllQuery }),
  controller.findAll
);

r.get(
  '/find-one/:id',
  authMiddleware(['ADM', 'KSK', 'PSI', 'USR']),
  controller.findById
);

r.post(
  '/create',
  authMiddleware(['ADM', 'PSI']),
  validatorMiddleware({ body: validator.create }),
  controller.create
);

r.patch(
  '/update/:id',
  authMiddleware(['ADM', 'PSI']),
  validatorMiddleware({ body: validator.update }),
  controller.update
);

r.delete('/delete/:id', authMiddleware(['ADM', 'PSI']), controller.delete);

const scheduleRouter = r;
export default scheduleRouter;
