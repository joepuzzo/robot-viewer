import { useEffect } from 'react';

export const useOverFlowHidden = () => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto'; // cleanup or run on page unmount
    };
  }, []);
};
