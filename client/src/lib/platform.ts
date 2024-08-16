import { LOCAL_STORAGE_KEYS } from './constants/app';

/**
 * Save auth token to local storage
 */

export function savePlatformAuthToken(authToken: string) {
  localStorage.setItem(LOCAL_STORAGE_KEYS.LAST_LOGIN_TOKEN, authToken);
}

/**
 * Get auth token from local storage
 */

export function fetchPlatformAuthToken(cb: (authToken: string | null) => void) {
  const platformAuthToken = localStorage.getItem(LOCAL_STORAGE_KEYS.LAST_LOGIN_TOKEN);

  // In mobile app, this will be a Promise, so we have to use callbacks
  cb(platformAuthToken);
}

