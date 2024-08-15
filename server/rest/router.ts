import { Router } from 'jsr:@oak/oak/router';
import composeAPI from './composeAPI.ts';
import authenticate from './authenticate.ts';

/**
 * Router for all APIs
 */

const router = new Router();

// Options
const allowAllOpts = {};
// const loginRequiredOpts = { loginRequired: true };

// Auth APIs
composeAPI(router, 'POST', '/authenticate', authenticate, allowAllOpts);

export default router;
