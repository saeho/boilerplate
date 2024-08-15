import { createContext } from 'react';
import type { AuthType } from '../../typescript/apiResultTypes.ts';

/**
 * Type; Reducer action for App Context
 */

type AppContextAction = {
  __type: 'APP_AUTH';
  data?: any;
};

export type AppContextDispatch = (action: AppContextAction) => void;

export type AppContextData = {
  init: 0 | 1 | 2; // 0: Not initialized, 1: Initializing, 2: Initialized
  auth: AuthType;
};

/**
 * Default context data
 */

export const DEFAULT_APP_CONTEXT = {
  init: 0,
  auth: {
    userId: null,
    token: null,
  },
};

/**
 * App reducer
 */

export const appReducer = (state: AppContextData, action: AppContextAction) => {
  const { __type, data } = action;
  switch (__type) {
    case 'APP_AUTH': {
      return {
        ...DEFAULT_APP_CONTEXT, // Reset context every time user/auth changes
        init: data.auth.token ? 2 : 1,
        auth: data.auth,
      };
    }
    default:
      if (process.env.NODE_ENV === 'development') {
        throw new Error('App Reducer Error: [' + __type + ']');
      } else {
        return state;
      }
  }
};

export default createContext(DEFAULT_APP_CONTEXT as AppContextData);
