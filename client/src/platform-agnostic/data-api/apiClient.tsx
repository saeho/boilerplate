import { useContext, useState, useEffect } from 'react';
import dataContext from '../data-context/dataContext';

const ENV = {
  API_URL: 'http://localhost:4000/',
};

/**
 * Types
 */

type APIParams = Partial<{
  onCompleted: (data: any, error: any) => void;
}>;

/**
 * Fetch data
 */

function fetchData(apiName: string, params: any, authToken: string, onCompleted: any) {

fetch(ENV.API_URL + apiName, {
  method: 'POST',
  headers: new Headers({
    'Content-Type': 'application/json; charset=utf-8',
    'Authorization': authToken,
    // api_key: ENV.GQL_API_KEY,
    // 'Access-Control-Allow-Origin': ENV.APP_URL,
    // recaptcha: ? // Not sure if we're going to do this on this later any more

  }),
  body: JSON.stringify(params || null),
}).then(async(res) => {
  if (res.status === 200) {
    onCompleted(await res.json(), null);
  } else {
    onCompleted(null, {
      status: res.status,
      message: res.statusText,
    });
  }
}).catch(err => {
  onCompleted(null, err);
  console.warn('API Error: ' + apiName);
  console.warn(err);
});
}

/**
 * Consistent data fetch() API hook
 */

export function useQuery(apiName: string, params: any) {

  const { dataState: { authToken }, dispatchData } = useContext(dataContext);
  const [qryState, setQryState] = useState({
    data: null,
    error: null,
    loading: false,
  });

  useEffect(() => {
    setQryState({...qryState, loading: true});
    fetchData(apiName, params, authToken, (fetchedData: any, error: any) => {
      setQryState({...qryState, data: fetchedData, error, loading: false});
    });
  }, []);

  return [qryState, dispatchData];
}

/**
 * Consistent data mutation fetch() API hook
 */

export function useMutation(apiName: string, params: APIParams = {}) {

  const { dataState: { authToken }, dispatchData } = useContext(dataContext);
  const [mtnState, setMtnState] = useState({
    error: null,
    mutating: false,
  });

  const { onCompleted } = params;
  const mutation = (params: any) => {
    setMtnState({...mtnState, mutating: true});
    fetchData(apiName, params, authToken, (fetchedData: any, error: any) => {
      setMtnState({error, mutating: false});

      if (onCompleted) {
        onCompleted(fetchedData, error);
      }
    });
  };

  return [mutation, mtnState, dispatchData];
}

