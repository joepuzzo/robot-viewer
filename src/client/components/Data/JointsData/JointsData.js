import React from 'react';

import { useFieldState } from 'informed';
import useRobotState from '../../../hooks/useRobotState';
import { Flex } from '@adobe/react-spectrum';
import { ARJointData } from './ARJointData';
import { IgusRebelJointData } from './IgusRebelJointData';
import { If } from '../../Shared/If';

const JointData = ({ motor }) => {
  const { value: robotType } = useFieldState('robotType');

  if (robotType === 'AR4') {
    return <ARJointData motor={motor} />;
  }

  if (robotType === 'IgusRebel') {
    return <IgusRebelJointData motor={motor} />;
  }

  return null;
};

// Example AR
const exampleAR = {
  homing: false,
  home: false,
  homed: false,
  enabled: true,
  moving: true,
  ready: true,
  stepPosition: -7733,
  encoderPosition: 77309,
  error: 'Ahh!!!!',
};

// EXAMPLE IGUS
const exampleIgus = {
  id: 'j0',
  canId: 16,
  homing: false,
  home: false,
  // TODO add to backend vvv
  ready: true,
  enabled: false,
  moving: false,
  // TODO add to backend ^^^
  currentPosition: 90.000235647645,
  currentTics: 8000,
  encoderPulsePosition: 90.000235647645,
  encoderPulseTics: 8000,
  jointPositionSetPoint: 90,
  jointPositionSetTics: 8000,
  goalPosition: 90,
  motorCurrent: 120,
  error: null,
  errorCode: null,
  errorCodeString: 'n/a',
  voltage: 0,
  tempMotor: 20,
  tempBoard: 30,
  direction: 'forwards',
  motorError: null,
  adcError: null,
  rebelError: null,
  controlError: null,
  sendInterval: 20,
  calculatedVelocity: 29,
  currentVelocity: 30,
  positionHistory: [
    { time: 1, pos: 10 },
    { time: 2, pos: 20 },
    { time: 3, pos: 30 },
    { time: 4, pos: 30 },
    { time: 5, pos: 10 },
  ],
};

export const JointsData = () => {
  const { robotStates } = useRobotState();

  // Get value of robotId && motorId
  const { value: robotId } = useFieldState('robotId');
  const { value: motorId } = useFieldState('motorId');

  // Get the selected robot state
  const robotState = robotStates[robotId];

  if (!robotState) {
    return null;
  }

  console.log('RENDER');

  const motors = Object.values(robotState.motors);

  // FOR TESTING WITHOUT CONNECTION
  //const motors = [exampleIgus];
  return (
    <Flex
      width="100%"
      direction="column"
      justifyContent="space-between"
      alignItems="center"
      gap="size-100"
    >
      <If condition={motorId != 'na' && motorId != null}>
        <JointData motor={robotState.motors[motorId]} />
      </If>
      <If condition={motorId == 'na' || motorId == null}>
        {motors.map((motor, i) => (
          <JointData motor={motor} key={`motor-${i}`} />
        ))}
      </If>
    </Flex>
  );
};
