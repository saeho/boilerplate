'use client';

import { useReducer, useEffect } from 'react';
import AppContext, { appReducer, type AppContextData, DEFAULT_APP_CONTEXT } from '../ck/data-context/appContext';
import DataContext, { dataReducer, DEFAULT_DATA_CONTEXT } from '../ck/data-context/dataContext';
import composeAuthenticate from '../ck/data-api/AuthenticateCmp';
import { fetchPlatformAuthToken } from '../lib/platform';

/**
 * Types
 */

type AppProps = {
  children: React.ReactNode;
  authToken: string | null;
  mutating: boolean;
  authenticate: (params: any) => void;
};

/**
 * Top level app events container
 */

function AppEvents(p: AppProps & AppContextData) {
  const { children, init, authenticate, mutating, auth, authToken } = p;

  useEffect(() => {
    if (!authToken || authToken !== auth.token && !mutating) {
      if (authToken) {
        authenticate({ authToken });
      } else {
        fetchPlatformAuthToken((platformAuthToken: string | null) => {
          authenticate({ authToken: platformAuthToken });
        });
      }
    }
  }, [authToken]);

  if (init !== 2) {
    return null;
  }

  return children;
}

const AppEventsWithData = composeAuthenticate(AppEvents);

/**
 * Top level app container with data management setup
 */

function App(p: any) {
  const { children } = p;
  const [appState, dispatchApp] = useReducer(appReducer, DEFAULT_APP_CONTEXT);
  const [dataState, dispatchData] = useReducer(dataReducer, DEFAULT_DATA_CONTEXT);

  // useApp();

  return <AppContext.Provider value={{ appState, dispatchApp } as any}>
    <DataContext.Provider value={{ dataState, dispatchData } as any}>
      <AppEventsWithData
        {...appState}
        authToken={dataState.authToken}
        dispatchApp={dispatchApp}
      >
        {children}
      </AppEventsWithData>
    </DataContext.Provider>
  </AppContext.Provider>;
}

export default App;
