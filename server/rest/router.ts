import { Router } from 'jsr:@oak/oak/router';
import composeAPI from './composeAPI.ts';
import authenticate from './authenticate.ts';
import { listProducts, createProductReport } from './products.ts';

/**
 * Router for all APIs
 */

const router = new Router();

// Options
const allowAllOpts = {};
const loginRequiredOpts = { loginRequired: true };

// Auth APIs
composeAPI(router, 'POST', '/authenticate', authenticate, allowAllOpts);

// Product APIs
composeAPI(router, 'POST', '/product_reports', createProductReport, loginRequiredOpts);
composeAPI(router, 'GET', '/products', listProducts, loginRequiredOpts);

export default router;
