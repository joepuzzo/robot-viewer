import { useContext } from 'react';
import CameraContext from '../context/CameraContext';

function useCamera() {
  const context = useContext(CameraContext);
  return context;
}

export default useCamera;
