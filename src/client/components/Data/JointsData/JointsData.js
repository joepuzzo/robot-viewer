import React from 'react';

import { useFieldState } from 'informed';
import useRobotState from '../../../hooks/useRobotState';
import { Flex } from '@adobe/react-spectrum';
import { ARJointData } from './ARJointData';
import { IgusRebelJointData } from './IgusRebelJointData';
import { If } from '../../Shared/If';
import { ExampleJointData } from './ExampleJointData';
import { EXAMPLE_IGUS_JOINT_DATA } from '../../../constants';
import { RizonJointData } from './RizonJointData';

const JointData = ({ motor }) => {
  const { value: robotType } = useFieldState('robotType');

  if (robotType === 'AR4') {
    return <ARJointData motor={motor} />;
  }

  if (robotType === 'IgusRebel') {
    return <IgusRebelJointData motor={motor} />;
  }

  if (robotType === 'Example') {
    return <ExampleJointData motor={motor} />;
  }

  if (robotType === 'Rizon4') {
    return <RizonJointData motor={motor} />;
  }

  return null;
};

export const JointsData = () => {
  const { robotStates } = useRobotState();

  // Get value of robotId && motorId
  const { value: robotId } = useFieldState('robotId');
  const { value: motorId } = useFieldState('motorId');

  // Get the robot type
  const { value: robotType } = useFieldState('robotType');

  // Get the selected robot state
  const robotState = robotStates[robotId];

  if (!robotState) {
    return null;
  }

  console.log('RENDER JOINTS DATA');

  const motors = Object.values(robotState.motors);

  // FOR TESTING WITHOUT CONNECTION
  // const motors = [EXAMPLE_IGUS_JOINT_DATA];
  return (
    <Flex
      width="100%"
      direction="column"
      justifyContent="space-between"
      alignItems="center"
      gap="size-100"
    >
      {motorId != 'na' && motorId != null && <JointData motor={robotState.motors[motorId]} />}
      <If condition={motorId == 'na' || motorId == null}>
        <>
          {motors.map((motor, i) => (
            <JointData motor={motor} key={`motor-${i}`} />
          ))}
        </>
      </If>
    </Flex>
  );
};
