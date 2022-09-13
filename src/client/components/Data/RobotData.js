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

const Status = ({ status }) => {
  if (status) {
    return (
      <StatusLight variant="positive" maxWidth={100}>
        Yes
      </StatusLight>
    );
  } else {
    return (
      <StatusLight variant="negative" maxWidth={100}>
        No
      </StatusLight>
    );
  }
};

// Example:
// {
//   "homing": false,
//   "home": false,
//   "homed": false,
//   "enabled": true,
//   "ready": true,
//   "stepPosition": -7733,
//   "encoderPosition": 77309
// }
const JointData = ({ motor }) => {
  return (
    <div>
      <h3>{motor.id}</h3>
      <TableView aria-label="Motor Statuses" flex width="size-3400">
        <TableHeader>
          <Column>Name</Column>
          <Column>Status</Column>
        </TableHeader>
        <TableBody>
          <Row>
            <Cell>Ready</Cell>
            <Cell>
              <Status status={motor.ready} />
            </Cell>
          </Row>
          <Row>
            <Cell>Homing</Cell>
            <Cell>
              <Status status={motor.homing} />
            </Cell>
          </Row>
          <Row>
            <Cell>Home</Cell>
            <Cell>
              <Status status={motor.home} />
            </Cell>
          </Row>
          <Row>
            <Cell>Homed</Cell>
            <Cell>
              <Status status={motor.homed} />
            </Cell>
          </Row>
          <Row>
            <Cell>Enabled</Cell>
            <Cell>
              <Status status={motor.enabled} />
            </Cell>
          </Row>
          <Row>
            <Cell>Step Position</Cell>
            <Cell>
              <span>{motor.stepPosition}</span>
            </Cell>
          </Row>
          <Row>
            <Cell>Encoder Position</Cell>
            <Cell>
              <span>{motor.encoderPosition}</span>
            </Cell>
          </Row>
          <Row>
            <Cell>Error</Cell>
            <Cell>
              <span>{motor.error}</span>
            </Cell>
          </Row>
        </TableBody>
      </TableView>
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
    <Flex
      width="100%"
      direction="column"
      justifyContent="space-between"
      alignItems="center"
      gap="size-100"
    >
      {motors.map((motor, i) => (
        <JointData motor={motor} key={`motor-${i}`} />
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
