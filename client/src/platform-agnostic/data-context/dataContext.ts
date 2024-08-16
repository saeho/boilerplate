import { createContext } from 'react';

/**
 * Type; Reducer action for Data Context
 */

type DataContextAction = {
  __type: 'DATA_TOKEN';
  data?: any;
};

export type DataContextDispatch = (action: DataContextAction) => void;

export type DataContextData = {
  authToken: string | null;
};

/**
 * Default context data
 */

export const DEFAULT_DATA_CONTEXT = {
  authToken: null,
};

/**
 * Data reducer
 */

export const dataReducer = (state: DataContextData, action: DataContextAction) => {
  const { __type, data } = action;
  switch (__type) {
    case 'DATA_TOKEN': {
      return {
        ...state,
        authToken: data.authToken,
      };
    }
    default:
      if (process.env.NODE_ENV === 'development') {
        throw new Error('Data Reducer Error: [' + __type + ']');
      } else {
        return state;
      }
  }
};

export default createContext(DEFAULT_DATA_CONTEXT as DataContextData);
