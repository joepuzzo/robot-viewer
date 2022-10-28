import React, {useEffect, useState} from 'react';
import { useFieldState } from 'informed';

import { Flex } from '@adobe/react-spectrum';
import LineGraph from './LineGraph';

import useRobotState from '../../../hooks/useRobotState';


export const MotorVisualizations = () => {

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
    positionHistory: [{time: 1, position:10}, {time: 2, position:20},{time: 3, position:30},{time: 4, position:30},{time: 5, position:50},]
  };

  const { robotStates } = useRobotState();
  // Get value of robotId && motorId
  const { value: robotId } = useFieldState('robotId');
  const { value: motorId } = useFieldState('motorId');
  // Get the selected robot state
  const robotState = robotStates[robotId];
  const selectedMotor = robotState?.[motorId] || exampleIgus;

  useEffect(() => {
    const interval = setInterval(() => {
        positionData.push({x:positionData.length, y: positionData.length})
        setPositionData([...positionData]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const [positionData, setPositionData] = useState(selectedMotor.positionHistory.map((i) => ({ x: i.time, y: i.position }))  );

  return (
    <Flex
      width="100%"
      direction="column"
      justifyContent="space-between"
      alignItems="center"
      gap="size-100"
    >
      <h2>Position</h2>
      <LineGraph data={positionData} />
    </Flex>
  );
};
