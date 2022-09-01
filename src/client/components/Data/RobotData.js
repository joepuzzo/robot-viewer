import React from 'react';
import { useFieldState } from 'informed';
import useRobotState from '../../hooks/useRobotState';
import { Flex } from '@adobe/react-spectrum';

const JointData = ({ motor }) => {
  return (
    <div>
      <pre>{JSON.stringify(motor, null, 2)}</pre>
    </div>
  );
};

const JointsData = () => {
  const { robotStates } = useRobotState();

  // Get value of robotId && motorId
  const { value: robotId } = useFieldState('robotId');
  const { value: motorId } = useFieldState('motorId');

  // Get the selected robot state
  const robotState = robotStates[robotId];

  if (!robotState) {
    return null;
  }

  const motors = Object.values(robotState.motors);

  return (
    <Flex direction="column" justifyContent="space-between" alignItems="center" gap="size-100">
      {motors.map((motor) => (
        <JointData motor={motor} />
      ))}
    </Flex>
  );
};

export const RobotData = () => {
  return (
    <div>
      <JointsData />
    </div>
  );
};
