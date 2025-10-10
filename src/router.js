import { Router } from 'express';
import roleRouter from './core/role/role.router.js';
import userRouter from './core/user/user.router.js';
import authRouter from './core/auth/auth.router.js';
import announcementRouter from './core/announcement/announcement.router.js';
import billRouter from './core/bill/bill.router.js';
import candidateRouter from './core/candidate/candidate.router.js';
import paymentRouter from './core/payment/payment.router.js';
import paymentrefRouter from './core/paymentref/paymentref.router.js';
import scheduleRouter from './core/schedule/schedule.router.js';
import seasonRouter from './core/season/season.router.js';
import formresponseRouter from './core/formresponse/formresponse.router.js';
import formRouter from './core/form/form.router.js';
import attachmentRouter from './core/attachment/attachment.router.js';

const r = Router();

r.use('/auth', authRouter);
r.use('/roles', roleRouter);
r.use('/users', userRouter);
r.use('/announcements', announcementRouter);
r.use('/bills', billRouter);
r.use('/candidates', candidateRouter);
r.use('/payments', paymentRouter);
r.use('/payment-refs', paymentrefRouter);
r.use('/schedules', scheduleRouter);
r.use('/seasons', seasonRouter);
r.use('/form-responses', formresponseRouter);
r.use('/forms', formRouter);
r.use('/attachments', attachmentRouter);

const router = r;
export default router;
