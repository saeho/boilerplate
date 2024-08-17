import { Router } from 'jsr:@oak/oak/router';
import composeAPI from './composeAPI.ts';
import authenticate from './authenticate.ts';
import { listClinicalTrials } from './clinical_trials.ts';

/**
 * Router for all APIs
 */

const router = new Router();

// Options
const allowAllOpts = {};
// const loginRequiredOpts = { loginRequired: true };

// Auth APIs
composeAPI(router, 'POST', '/authenticate', authenticate, allowAllOpts);

// Clinical trial APIs
composeAPI(router, 'GET', '/clinical_trials', listClinicalTrials, allowAllOpts);

export default router;
