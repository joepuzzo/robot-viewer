import { useContext } from 'react';
import { RobotMetaContext } from '../context/RobotContext';

function useRobotMeta() {
  const robotMeta = useContext(RobotMetaContext);
  return robotMeta;
}

export default useRobotMeta;
