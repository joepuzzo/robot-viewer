import axios from 'axios';
import { useCallback, useState } from 'react';

export const usetPost = ({ url, headers }) => {
  const [res, setRes] = useState({ data: null, error: null, loading: false });
  // You POST method here
  const post = useCallback(
    ({ payload, url: newUrl }) => {
      setRes((prevState) => ({ ...prevState, loading: true }));
      axios
        .post(newUrl ?? url, payload)
        .then((res) => {
          setRes({ data: res.data, loading: false, error: null });
        })
        .catch((error) => {
          setRes({ data: null, loading: false, error });
        });
    },
    [url, headers]
  );
  return [res, post];
};
