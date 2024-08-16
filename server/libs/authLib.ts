import { crypto } from '@std/crypto';
import { create as createJWT, verify as verifyJWT } from 'djwt';
import type { AuthType } from '../typescript/apiResultTypes.ts';

let CRYPTO_KEY: any;

const JWT_SECRET = 'super-secret-from-env-file';

/**
 * Make Crypto key for JWT Tokens
 */

async function makeCryptoKey() {
  if (!CRYPTO_KEY) {
    const enc = new TextEncoder();
    CRYPTO_KEY = await crypto.subtle.importKey(
      'raw',
      enc.encode(JWT_SECRET),
      { name: 'HMAC', hash: 'SHA-512' },
      false,
      ['sign', 'verify'],
    );
  }
  return CRYPTO_KEY;
}

/**
 * Fetch API user from token
 */

export async function fetchAuth(token: string): Promise<AuthType | null> {
  if (token === 'null') {
    return null;
  }

  const tokenContent = await verifyJWT(token, await makeCryptoKey());
  if (!tokenContent?.userId) {
    return null;
  }

  return {
    token,
    userId: tokenContent.userId as string
  };
}

/**
 * Create a new API user
 */

export async function createAuth(): Promise<AuthType> {
  const userId = crypto.randomUUID();
  const cryptoKey = await makeCryptoKey();

  const token = await createJWT({
    alg: 'HS512',
    typ: 'JWT',
  }, {
    userId,
    createdAt: Date.now(),
  },
    cryptoKey,
  );

  return {
    token,
    userId,
  };
}
