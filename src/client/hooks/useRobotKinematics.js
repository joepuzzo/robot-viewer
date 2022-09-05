import { useContext } from 'react';
import { RobotKinimaticsContext } from '../context/RobotContext';

function useRobotKinematics() {
  const robotKinematics = useContext(RobotKinimaticsContext);
  return robotKinematics;
}

export default useRobotKinematics;
