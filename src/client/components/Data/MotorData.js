import React from 'react';
import { useFieldState } from 'informed';
import useRobotState from '../../hooks/useRobotState';
import {
  Flex,
  TableView,
  TableHeader,
  TableBody,
  Column,
  Row,
  Cell,
  StatusLight,
} from '@adobe/react-spectrum';

const MotorState = ({ robotId, motorId }) => {
  const { robotStates } = useRobotState();

  // Get the selected motor state
  const motorState =
    robotStates[robotId] && robotStates[robotId]?.motors[motorId]
      ? robotStates[robotId].motors[motorId]
      : {};
  return (
    <div>
      <pre>{JSON.stringify(motorState, null, 2)}</pre>
    </div>
  );
};

export const MotorData = () => {
  const { robotStates } = useRobotState();

  // Get value of robotId && motorId
  const { value: robotId } = useFieldState('robotId');
  const { value: motorId } = useFieldState('motorId');

  // Get the selected robot state
  const robotState = robotStates[robotId];

  if (!robotState) {
    return null;
  }

  return <MotorState robotId={robotId} motorId={motorId} />;
};
