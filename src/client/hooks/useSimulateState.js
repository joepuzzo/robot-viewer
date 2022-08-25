import { useContext } from 'react';
import { SimulateStateContext } from '../context/SimulateContext';

function useSimulateState() {
  const simulateState = useContext(SimulateStateContext);
  return simulateState;
}

export default useSimulateState;
