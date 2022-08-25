import { useContext } from 'react';
import { SimulateControllerContext } from '../context/SimulateContext';

function useSimulateController() {
  const simulateController = useContext(SimulateControllerContext);
  return simulateController;
}

export default useSimulateController;
