import express from 'express';
const router = express.Router();
// import authenticationRouter from './core/authentication/authentication.router';

interface RouteConfig {
  path: string;
  route: express.Router;
}

export const routeLists: RouteConfig[] = [
  // {
  //   path: '/auth',
  //   route: authenticationRouter,
  // },
];

routeLists.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
