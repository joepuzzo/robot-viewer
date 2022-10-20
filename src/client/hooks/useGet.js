import axios from 'axios';
import { useCallback, useState } from 'react';

export const useGet = ({ url, headers, onComplete } = {}) => {
  const [res, setRes] = useState({ data: null, error: null, loading: false });
  // You GET method here
  const post = useCallback(
    ({ url: newUrl }) => {
      setRes((prevState) => ({ ...prevState, loading: true }));
      axios
        .get(newUrl ?? url)
        .then((res) => {
          setRes({ data: res.data, loading: false, error: null });
          if (onComplete) {
            onComplete(res.data);
          }
        })
        .catch((error) => {
          setRes({ data: null, loading: false, error });
        });
    },
    [url, headers]
  );
  return [res, post];
};
