import { useContext } from 'react';
import { RobotControllerContext } from '../context/RobotContext';

function useRobotController() {
  const robotController = useContext(RobotControllerContext);
  return robotController;
}

export default useRobotController;
