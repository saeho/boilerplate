import type { AuthenticateResult } from '../typescript/apiResultTypes.ts';
import { createAuth, fetchAuth } from '../libs/authLib.ts';

/**
 * Types
 */

type AuthenticateArgs = {
  authToken: string | null;
};

/**
 * Authenticate user's JWT token.
 * If it doesn't exist, create a new JWT token and send to user.
 */

async function authenticate(args: AuthenticateArgs): Promise<AuthenticateResult> {

  const { authToken } = args;

  let auth;
  if (authToken) {
    auth = await fetchAuth(authToken);
  }

  if (!auth) {
    auth = await createAuth();
  }

  return {
    auth,
  };
}

export default authenticate;
