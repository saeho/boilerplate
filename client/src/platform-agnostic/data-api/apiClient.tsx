'use client';

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

function fetchData(method: string, apiName: string, params: any, authToken: string, onCompleted: any) {

  let body;
  let fetchUrl = ENV.API_URL + apiName;

  if (method === 'GET') {
    const ents = params && Object.entries(params);
    if (ents?.length) {
      let urlParams = '';
      for (const [key, value] of ents) {
        if (typeof value !== 'undefined') {
          urlParams += `${(urlParams ? '&' : '?')}${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        }
      }

      if (urlParams) {
        fetchUrl += urlParams;
      }
    }
  } else {
    body = JSON.stringify(params || null);
  }

  fetch(fetchUrl, {
    method,
    headers: new Headers({
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': authToken,
      // api_key: ENV.GQL_API_KEY,
      // 'Access-Control-Allow-Origin': ENV.APP_URL,
      // recaptcha: ? // Not sure if we're going to do this on this later any more
    }),
    body,
  }).then(async(res) => {

    if (res.status === 200) {
      const contentType = res.headers.get('content-type') || '';
      if (contentType.startsWith('application/json')) {
        const jsonData = await res.json();
        onCompleted(jsonData, null);
        return;
      }

      const plainText = await res.text();
      onCompleted(plainText, null);

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
    fetchData('GET', apiName, params, authToken, (fetchedData: any, error: any) => {
      setQryState({...qryState, data: fetchedData, error, loading: false});
    });
  }, [JSON.stringify(params)]);

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
    fetchData('POST', apiName, params, authToken, (fetchedData: any, error: any) => {
      setMtnState({error, mutating: false});

      if (onCompleted) {
        onCompleted(fetchedData || {}, error);
      }
    });
  };

  return [mutation, mtnState, dispatchData];
}

