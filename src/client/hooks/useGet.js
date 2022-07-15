import React, { useEffect, useRef, useReducer, useState } from 'react';
import axios from 'axios';
// import useAuthentication from '../../../hooks/useAuthentication';

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_INIT':
      return {
        ...state,
        loading: true,
        error: undefined,
      };
    case 'FETCH_SUCCESS':
      const data =
        action.append && state.data ? [...state.data, ...action.payload] : action.payload;
      return {
        ...state,
        loading: false,
        error: undefined,
        data,
        isEmpty: Array.isArray(action.payload) && action.payload.length === 0,
      };
    case 'FETCH_FAILURE':
      return {
        data: undefined,
        loading: false,
        error: action.error,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const configureOptions = ({ opts, source, authHeader }) => {
  const defaultHeaders = {
    // Authorization: authHeader,
    // Accept: 'application/json'
  };

  const configuredOptions = {
    cancelToken: source.token,
    ...opts,
  };

  if (opts && opts.headers) {
    configuredOptions.headers = {
      ...defaultHeaders,
      ...opts.headers,
    };
  } else {
    configuredOptions.headers = defaultHeaders;
  }

  return configuredOptions;
};

const useGet = ({ url, options, noInitial, success, failure, retry, key }, reget = []) => {
  //   const { authHeader } = useAuthentication();

  const [state, dispatch] = useReducer(dataFetchReducer, {
    loading: !noInitial,
    error: null,
    data: null,
  });

  const [_, throwError] = useState();

  // Becaues we wrap these up in refetch
  const urlRef = useRef(url);
  const optionsRef = useRef(options);
  const retryRef = useRef(retry);
  urlRef.current = url;
  optionsRef.current = options;
  retryRef.current = retry;

  const fetchData = async (uri, opts, handlers, fetchConfig, append) => {
    // Create axios cancel token to cancel old requests
    const source = axios.CancelToken.source();

    // Configure options
    // const configuredOptions = configureOptions(opts, authHeader );
    const configuredOptions = configureOptions({ opts, source });

    // We are starting to fetch
    dispatch({ type: 'FETCH_INIT' });

    // Define error handler function
    const handleError = (e) => {
      // Call failure handler if there is one
      if (handlers.failure) {
        handlers.failure(e);
      }
      dispatch({ type: 'FETCH_FAILURE', error: e });
    };

    try {
      const result = await axios.get(uri, configuredOptions);
      const payload = key ? result.data[key] : result.data;
      dispatch({ type: 'FETCH_SUCCESS', payload, append });
      // Call success handler if there is one
      if (handlers.success) {
        handlers.success(payload);
      }
    } catch (error) {
      // Only set error if request was NOT cancled
      if (!axios.isCancel(error)) {
        handleError(error);
      }
    }
  };

  useEffect(() => {
    //Create handlers
    const handlers = {
      success,
      failure,
    };

    if (!noInitial) {
      fetchData(url, options, handlers);
    }

    () => {
      // TODO cleanup if unmounted
    };
  }, [url, ...reget]);

  const get = ({
    url: newUrl,
    options: newOptions,
    success: newSuccess,
    failure: newFailure,
    retry: newRetry,
    append,
  } = {}) => {
    // Create handlers
    const handlers = {
      success: newSuccess || success,
      failure: newFailure || failure,
    };

    const fetchConfig = {
      retry: newRetry || retryRef.current,
    };

    // Fetch the data
    fetchData(
      newUrl || urlRef.current,
      newOptions || optionsRef.current,
      handlers,
      fetchConfig,
      append
    );
  };

  return {
    ...state,
    get,
  };
};

export default useGet;
