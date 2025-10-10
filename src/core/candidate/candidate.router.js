import { Router } from 'express';
import validatorMiddleware from '../../middlewares/validator.middleware.js';
import CandidateController from './candidate.controller.js';
import CandidateValidator from './candidate.validator.js';
import { baseValidator } from '../../base/validator.base.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { upload } from '../../middlewares/upload.middleware.js';
import { mbToBytes } from '../../utils/number.js';

const r = Router(),
  validator = CandidateValidator,
  controller = new CandidateController();

r.get('/download-photo/:id', authMiddleware(), controller.downloadPhoto);

r.get(
  '/stats',
  authMiddleware(),
  validatorMiddleware({ query: baseValidator.findAllQuery }),
  controller.stats
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
  authMiddleware(['USR']),
  validatorMiddleware({ body: validator.create }),
  controller.create
);

r.patch(
  '/update/:id',
  authMiddleware(['USR']),
  upload({
    maxBytes: mbToBytes(3),
    mimeTypes: ['image/png', 'image/jpeg', 'image/jpg'],
  }).single('photo'),
  validatorMiddleware({ body: validator.update }),
  controller.update
);

r.patch(
  '/update-admin/:id',
  authMiddleware(['ADM', 'KSK']),
  validatorMiddleware({ body: validator.updateAdmin }),
  controller.update
);

r.patch(
  '/update-by-schedule/:id',
  authMiddleware(['ADM', 'KSK', 'PSI']),
  validatorMiddleware({ body: validator.updateBySchedule }),
  controller.update
);

r.patch(
  '/update-by-acceptance-user/:id',
  authMiddleware(['USR']),
  validatorMiddleware({ body: validator.acceptanceUser }),
  controller.acceptanceUser
);

r.patch(
  '/update-by-acceptance-admin/:id',
  authMiddleware(['ADM', 'KSK']),
  validatorMiddleware({ body: validator.acceptanceAdmin }),
  controller.acceptanceAdmin
);

r.delete('/delete/:id', authMiddleware(['ADM', 'KSK']), controller.delete);

const candidateRouter = r;
export default candidateRouter;
