import { Router } from 'jsr:@oak/oak/router';
import { fetchAuth } from '../libs/authLib.ts';
import type { APIUser, APIContext } from '../typescript/serverTypes.ts';

/**
 * Types
 */

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

type APIFunction = (
  args: any,
  apiUser: APIUser | null,
  context: APIContext,
  router: Router,
) => Promise<any> | any;

type APIOptions = Partial<{
  loginRequired: boolean;
  rateLimit: number;
  rateLimitExpireIn: number;
  cached: boolean;
  expireIn: number;
}>;

/**
 * API Authorization; using JWT token
 */

async function apiAuthorization(ctx): Promise<{ apiUser: APIUser | null, context: APIContext }> {

  const authToken = ctx.request.headers.get('authorization');

  let apiUser = {
    loggedIn: false,
    userId: null,
  } as APIUser | null;

  if (authToken) {
    const auth = await fetchAuth(authToken);

    apiUser = {
      loggedIn: !!auth?.userId,
      userId: auth?.userId || null,
    };
  }

  const context = {
    token: authToken,
    ipAddress: ctx.request.ip,
  };

  return {
    apiUser,
    context
  }
}

/**
 * Compose a function for GraphQL with cache support
 */

function composeAPI(
  router: Router,
  httpMethod: HTTPMethod,
  path: string,
  apiFn: APIFunction,
  apiOpts: APIOptions,
) {

  const { loginRequired, cached } = apiOpts;

  const callback = async (ctx) => {
    const { apiUser, context } = await apiAuthorization(ctx);
    if (!apiUser?.loggedIn && loginRequired) {
      throw new Error('login required');
    }

    let args;
    switch (ctx.request.method) {
      case 'POST':
        args = await ctx.request.body.json();
        break;
      case 'GET':
        args = Object.fromEntries(ctx.request.url.searchParams.entries());
        break;
      default:
    }

    const result = await apiFn(args, apiUser, context, router);

    ctx.response.body = result;
  };

  switch (httpMethod) {
    case 'GET':
      router.get(path, callback);
      break;
    case 'POST':
      router.post(path, callback);
      break;
    case 'PUT':
      router.put(path, callback);
      break;
    case 'DELETE':
      router.delete(path, callback);
      break;
    default:
  }
}

export default composeAPI;
