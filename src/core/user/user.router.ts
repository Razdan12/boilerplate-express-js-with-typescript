import { Router } from 'express';
import validatorMiddleware from '../../middlewares/validator.middleware';
import UserController from './user.controller';
import UserValidator from './user.validator';
import { baseValidator } from '../../base/validator.base';
import auth from '../../middlewares/auth.middleware';

const r = Router();
const controller = new UserController();

r.get('/show-all', validatorMiddleware({ query: baseValidator.browseQuery }), controller.findAll);
r.get('/show-one/:id', controller.findById);

r.post('/create', auth(['ADMIN']), validatorMiddleware({ body: UserValidator.create }), controller.create);
r.put('/update/:id', auth(['ADMIN']), validatorMiddleware({ body: UserValidator.update }), controller.update);
r.delete('/delete/:id', auth(['ADMIN']), controller.delete);

const userRouter = r;
export default userRouter;
