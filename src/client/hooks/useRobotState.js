import { useContext } from 'react';
import { RobotStateContext } from '../context/RobotContext';

function useRobotState() {
  const robotState = useContext(RobotStateContext);
  return robotState;
}

export default useRobotState;
