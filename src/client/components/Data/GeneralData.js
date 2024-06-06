import React from 'react';

import { ActionButton, Flex } from '@adobe/react-spectrum';
import Copy from '@spectrum-icons/workflow/Copy';
import useRobotState from '../../hooks/useRobotState';
import { useFieldState } from 'informed';
import { TYPE_MAPPING } from '../../constants';
import { round } from '../../../lib/round';

export const Info = ({ label, data, copy }) => {
  return (
    <div className="info-container">
      <div>
        <strong>{label}</strong>
      </div>
      <div className="info-data">
        <span>{data}</span>
        {copy ? (
          <button
            style={{ marginLeft: '5px', border: 'none' }}
            className="icon-button"
            title="copy"
            onClick={() => {
              navigator.clipboard.writeText(copy);
            }}
          >
            &#128203;
          </button>
        ) : null}
      </div>
    </div>
  );
};

const Joints = ({ motors, robotType }) => {
  const copyText = motors
    .map((motor) => {
      const fieldName = TYPE_MAPPING[robotType].position;
      const motorPos = motor[fieldName];
      return round(motorPos, 1000);
    })
    .join(', ');

  const displayText = motors
    .map((motor) => {
      const fieldName = TYPE_MAPPING[robotType].position;
      const motorPos = motor[fieldName];
      return round(motorPos, 10);
    })
    .join('\u00A0\u00A0\u00A0\u00A0');

  return <Info label="Joints:" data={displayText} copy={copyText} />;
};

const ToolCenterPointPosition = ({ robotState, robotType }) => {
  const fieldName = TYPE_MAPPING[robotType].tcpPose;

  // Array x, y, z, r1, r2, r3
  const tcpPos = robotState[fieldName];

  // Dont try to render if we dont have it
  if (!tcpPos) {
    return null;
  }

  const copyText = tcpPos.map((p) => round(p, 1000)).join(', ');

  const displayText = tcpPos.map((p) => round(p, 100)).join('\u00A0\u00A0\u00A0\u00A0');

  return <Info label="TCP:" data={displayText} copy={copyText} />;
};

const TCPWrench = ({ robotState, robotType }) => {
  const fieldName = TYPE_MAPPING[robotType].extWrenchInTcp;

  // Array x, y, z, r1, r2, r3
  const extWrenchInTcp = robotState[fieldName];

  // Dont try to render if we dont have it
  if (!extWrenchInTcp) {
    return null;
  }

  const copyText = extWrenchInTcp.map((p) => round(p, 1000)).join(', ');

  const displayText = extWrenchInTcp.map((p) => round(p, 100)).join('\u00A0\u00A0\u00A0\u00A0');

  return <Info label="TCP Wrench:" data={displayText} copy={copyText} />;
};

export const GeneralData = () => {
  const { robotStates } = useRobotState();

  // Get value of robotId && motorId
  const { value: robotId } = useFieldState('robotId');

  // Get the robot type
  const { value: robotType } = useFieldState('robotType');

  // Get the selected robot state
  const robotState = robotStates[robotId];

  if (!robotState) {
    return null;
  }

  // console.log('RENDER GENERAL DATA');

  const motors = Object.values(robotState.motors);

  return (
    <>
      <Flex
        width="100%"
        // width="380px"
        direction="column"
        gap="size-100"
      >
        <Joints motors={motors} robotType={robotType} />
        <ToolCenterPointPosition robotState={robotState} robotType={robotType} />
        <TCPWrench robotState={robotState} robotType={robotType} />
      </Flex>
    </>
  );
};
