import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { ServiceRoutes } from '../app/modules/service/service.route';
import { RuleRoutes } from '../app/modules/rule/rule.route';
import { ServingRoutes } from '../app/modules/serving/serving.routes';
const router = express.Router();

const apiRoutes = [
  { path: '/user', route: UserRoutes },
  { path: '/auth', route: AuthRoutes },
  { path: '/service', route: ServiceRoutes },
  { path: '/rule', route: RuleRoutes },
  { path: '/serving', route: ServingRoutes },
];

apiRoutes.forEach(route => router.use(route.path, route.route));
export default router;