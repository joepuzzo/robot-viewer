import React from 'react';

import { useFieldState } from 'informed';
import useRobotState from '../../../hooks/useRobotState';
import { Cell, Column, Flex, Row, TableBody, TableHeader, TableView } from '@adobe/react-spectrum';
import { ARJointData } from './ARJointData';
import { IgusRebelJointData } from './IgusRebelJointData';
import { If } from '../../Shared/If';
import { ExampleJointData } from './ExampleJointData';
import { TYPE_MAPPING } from '../../../constants';

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

  return null;
};

// Example AR
const exampleAR = {
  id: 'j0',
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
  //const motors = [exampleIgus];
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
          <br />
          <Flex direction="row" alignItems="center" gap="size-100">
            <TableView aria-label="Motor Positions" flex width="380px">
              <TableHeader>
                {motors.map((motor, i) => (
                  <Column key={`JointPos-Header-${i}`}>{`J${i}`}</Column>
                ))}
              </TableHeader>
              <TableBody>
                <Row>
                  {motors.map((motor, i) => {
                    const fieldName = TYPE_MAPPING[robotType].position;
                    const motorPos = motor[fieldName];

                    return <Cell key={`JointPos-${i}`}>{motorPos}</Cell>;
                  })}
                </Row>
              </TableBody>
            </TableView>
          </Flex>

          {motors.map((motor, i) => (
            <JointData motor={motor} key={`motor-${i}`} />
          ))}
        </>
      </If>
    </Flex>
  );
};
