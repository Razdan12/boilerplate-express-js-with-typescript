import { Router } from 'express';
import validatorMiddleware from '../../middlewares/validator.middleware.js';
import AnnouncementController from './announcement.controller.js';
import AnnouncementValidator from './announcement.validator.js';
import { baseValidator } from '../../base/validator.base.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const r = Router(),
  validator = AnnouncementValidator,
  controller = new AnnouncementController();

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

const announcementRouter = r;
export default announcementRouter;
