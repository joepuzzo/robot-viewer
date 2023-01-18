import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useFieldState, useFormApi } from 'informed';

import { Button, Flex } from '@adobe/react-spectrum';
import LineGraph from './LineGraph';

import useRobotState from '../../../hooks/useRobotState';
import useApp from '../../../hooks/useApp';
import { useStateWithGetter } from '../../../hooks/useStateWithGetter';

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
    positionHistory: [
      { time: 1, position: 10 },
      { time: 2, position: 20 },
      { time: 3, position: 30 },
      { time: 4, position: 30 },
      { time: 5, position: 50 },
    ],
  };

  const { socket } = useApp();
  const { robotStates } = useRobotState();
  // Get value of robotId && motorId
  const { value: robotId } = useFieldState('robotId');
  const { value: motorId } = useFieldState('motorId');
  // Get the selected robot state
  const robotState = robotStates[robotId];
  const selectedMotor = robotState?.[motorId] || exampleIgus;
  const formApi = useFormApi();
  0;
  const [capture, setCapture, getCapture] = useStateWithGetter(true);

  const [positionData, setPositionData] = useState([{ x: Date.now(), y: 0 }]);
  const [velocityData, setVelocityData] = useState([{ x: Date.now(), y: 0 }]);
  const [actualVelocityData, setActualVelocityData] = useState([{ x: Date.now(), y: 0 }]);

  // Use me for fake position updates
  // const [positionData, setPositionData] = useState(
  //   selectedMotor.positionHistory.map((i) => ({ x: i.time, y: i.position }))
  // );
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setPositionData((prev) => {
  //       prev.push({ x: positionData.length, y: positionData.length });
  //       return [...prev];
  //     });
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);

  const stateHandler = (id, robotState) => {
    const motorId = formApi.getFormState().values?.motorId;
    if (motorId && getCapture()) {
      setPositionData((prev) => {
        if (prev.length >= 500) {
          prev.shift();
        }
        prev.push({ x: Date.now(), y: robotState?.motors?.[motorId]?.currentPosition || 0 });
        return [...prev];
      });
      setVelocityData((prev) => {
        if (prev.length >= 500) {
          prev.shift();
        }
        prev.push({ x: Date.now(), y: robotState?.motors?.[motorId]?.currentVelocity || 0 });
        return [...prev];
      });
      setActualVelocityData((prev) => {
        if (prev.length >= 500) {
          prev.shift();
        }
        prev.push({ x: Date.now(), y: robotState?.motors?.[motorId]?.calculatedVelocity || 0 });
        return [...prev];
      });
    }
  };

  useEffect(() => {
    socket.on('robot', stateHandler);
    return () => {
      socket.removeListener('robot', stateHandler);
    };
  }, []);

  const toggleCapture = useCallback(() => {
    setCapture((prev) => !prev);
  }, []);

  return (
    <Flex
      width="100%"
      direction="column"
      justifyContent="space-between"
      alignItems="center"
      gap="size-100"
    >
      <h2>Capture</h2>
      <Button onPress={toggleCapture}>{capture ? 'Stop' : 'Start'}</Button>
      <h2>Position</h2>
      <LineGraph
        data={positionData}
        // data2={positionData.map((d) => ({ x: d.x, y: d.y * 2 }))}
        xMin={positionData[0]?.x || Date.now()}
        xMax={positionData[positionData.length - 1]?.x || Date.now()}
        yMin={0}
        yMax={360}
      />
      <h2>Velocity</h2>
      <LineGraph
        data={velocityData}
        data2={actualVelocityData}
        xMin={velocityData[0]?.x || Date.now()}
        xMax={velocityData[velocityData.length - 1]?.x || Date.now()}
        yMin={0}
        yMax={100}
      />
    </Flex>
  );
};
