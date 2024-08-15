import type { AuthenticateResult } from '../typescript/apiResultTypes.ts';
import { createAuth, fetchAuth } from '../libs/authLib.ts';
import { fetchCanvasSession, createCanvasSession } from '../libs/canvasLib.ts';

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

  let auth; let canvasSession;
  if (authToken) {
    auth = await fetchAuth(authToken);
    canvasSession = await fetchCanvasSession(auth.userId);
  }

  if (!auth) {
    auth = await createAuth();
    canvasSession = await createCanvasSession(auth.userId);
  }

  return {
    auth,
    canvasSession
  };
}

export default authenticate;

// if (import.meta.main) {
//   console.log('Add 2 + 3 =', add(2, 3));
// }

// import { assertEquals } from '@std/assert';
// import { add } from './main.ts';

// Deno.test(function addTest() {
//   assertEquals(add(2, 3), 5);
// });
