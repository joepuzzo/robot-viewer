import { useContext } from 'react';
import AppContext from '../context/AppContext.js';

function useApp() {
  const appContext = useContext(AppContext);
  return appContext;
}

export default useApp;
