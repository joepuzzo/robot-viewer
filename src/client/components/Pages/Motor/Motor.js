import { useFieldState, useFormApi, useFormState } from 'informed';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import useApp from '../../../hooks/useApp';
import InputSlider from '../../Informed/InputSlider';
import Alert from '@spectrum-icons/workflow/Alert';
import { ActionButton, Flex } from '@adobe/react-spectrum';
import useRobotState from '../../../hooks/useRobotState';
import useRobotMeta from '../../../hooks/useRobotMeta';
import Input from '../../Informed/Input';
import { MotorVisualizations } from '../../Data/Visualizations/MotorVisualizations';

// import { useSpring, animated } from 'react-spring';

const MotorCircle = () => {
  const { value } = useFieldState('motorPos');

  let motorPos = value;

  const { robotStates } = useRobotState();

  // Get value of robotId && motorId
  const { value: robotId } = useFieldState('robotId');
  const { value: motorId } = useFieldState('motorId');

  // Get the selected robot state
  const robotState = robotStates[robotId];

  const { value: robotType } = useFieldState('robotType');

  // If we are connected to motor use its real position instead
  if (robotId && motorId != 'na' && robotState && robotState.motors[motorId]) {
    motorPos =
      robotType === 'AR4'
        ? robotState.motors[motorId].encoderPosition
        : robotState.motors[motorId].currentPosition;
  }

  return (
    <svg width="375" height="375">
      <g transform={`rotate(${motorPos ?? 0} 187.5 187.5)`}>
        <circle
          cx="187.5"
          cy="187.5"
          r="150"
          fill="grey"
          stroke="rgb(107,18,10)"
          strokeWidth="12"
        />
        <circle cx="187.5" cy="75" r="12" fill="black" />
      </g>
    </svg>
  );
};

export const Motor = () => {
  const { socket } = useApp();

  const formApi = useFormApi();

  // const { rotation: motorPos } = useSpring({
  //   rotation: value,
  //   config: {
  //     clamp: true,
  //     tension: 70,
  //   },
  // });

  const { connected } = useRobotMeta();

  console.log('RENDER MOTOR PAGE');

  // Ref to use in functions for if robot is connected
  const connectedRef = useRef();
  connectedRef.current = connected;

  // Get value of robotId && motorId
  const { value: robotId } = useFieldState('robotId');
  const { value: motorId } = useFieldState('motorId');

  const motorSetPos = useCallback(({ value }) => {
    const motorId = formApi.getValue('motorId');
    const robotId = formApi.getValue('robotId');
    // only send if we are connected and have selected motor
    if (connectedRef.current && motorId != 'na') {
      socket.emit('motorSetPos', robotId, motorId, value);
    }
  }, []);

  const motorResetErrors = useCallback(() => {
    const motorId = formApi.getValue('motorId');
    const robotId = formApi.getValue('robotId');
    // only send if we are connected and have selected motor
    if (connectedRef.current && motorId != 'na') {
      socket.emit('motorResetErrors', robotId, motorId);
    }
  }, []);

  const motorEnable = useCallback(() => {
    const motorId = formApi.getValue('motorId');
    const robotId = formApi.getValue('robotId');
    // only send if we are connected and have selected motor
    if (connectedRef.current && motorId != 'na') {
      socket.emit('motorEnable', robotId, motorId);
    }
  }, []);

  const motorDisable = useCallback(() => {
    const motorId = formApi.getValue('motorId');
    const robotId = formApi.getValue('robotId');
    // only send if we are connected and have selected motor
    if (connectedRef.current && motorId != 'na') {
      socket.emit('motorDisable', robotId, motorId);
    }
  }, []);

  const motorCalibrate = useCallback(() => {
    const motorId = formApi.getValue('motorId');
    const robotId = formApi.getValue('robotId');
    // only send if we are connected and have selected motor
    if (connectedRef.current && motorId != 'na') {
      socket.emit('motorCalibrate', robotId, motorId);
    }
  }, []);

  const queryMotorPosition = useCallback(() => {
    const motorId = formApi.getValue('motorId');
    const robotId = formApi.getValue('robotId');
    // only send if we are connected and have selected motor
    if (connectedRef.current && motorId != 'na') {
      socket.emit('queryMotorPosition', robotId, motorId);
    }
  }, []);

  const queryMotorParameter = useCallback(() => {
    const motorId = formApi.getValue('motorId');
    const robotId = formApi.getValue('robotId');
    const parameterIndex = formApi.getValue('parameterIndex');
    const parameterSubindex = formApi.getValue('parameterSubindex');
    // only send if we are connected and have selected motor
    if (connectedRef.current && motorId != 'na') {
      socket.emit('queryMotorParameter', robotId, motorId, parameterIndex, parameterSubindex);
    }
  }, []);

  const motorZero = useCallback(() => {
    const motorId = formApi.getValue('motorId');
    const robotId = formApi.getValue('robotId');
    // only send if we are connected and have selected motor
    if (connectedRef.current && motorId != 'na') {
      socket.emit('motorZero', robotId, motorId);
      formApi.setValue('motorPos', 0);
    }
  }, []);

  const motorHome = useCallback(() => {
    const motorId = formApi.getValue('motorId');
    const robotId = formApi.getValue('robotId');
    formApi.setValue('motorPos', 0);
    // only send if we are connected and have selected motor
    if (connectedRef.current && motorId != 'na') {
      socket.emit('motorHome', robotId, motorId);
    }
  }, []);

  const robotHome = useCallback(() => {
    const robotId = formApi.getValue('robotId');
    // only send if we are connected and have selected motor
    if (connectedRef.current) {
      socket.emit('robotHome', robotId);
    }
  }, []);

  return (
    <>
      <Flex direction="row" alignItems="center" gap="size-100">
        <h1>Motor Controller</h1>
        {!connected ? <Alert.default aria-label="Negative Alert" color="negative" /> : null}
      </Flex>
      <InputSlider
        name="motorPos"
        label="Set Position"
        onNativeChange={motorSetPos}
        type="number"
        minValue={-360}
        maxValue={360}
        initialValue={0}
        step={1}
        trackGradient="rgb(107,18,10)"
      />
      <Flex direction="row" justifyContent="space-between" gap="size-100">
        <Flex
          width="size-2400"
          direction="column"
          alignItems="center"
          justifyContent="center"
          gap="size-300"
        >
          <ActionButton width="size-2400" onPress={motorHome}>
            Home
          </ActionButton>
          <ActionButton width="size-2400" onPress={motorZero}>
            Zero Motor
          </ActionButton>
          <ActionButton width="size-2400" onPress={robotHome}>
            Robot Home
          </ActionButton>
          <ActionButton width="size-2400" onPress={queryMotorPosition}>
            Query Motor Pos
          </ActionButton>
        </Flex>
        <Flex direction="column" alignItems="center" gap="size-100" width="400px">
          <MotorCircle />
          <Flex alignItems="end" gap="size-100">
            <Input name="parameterIndex" label="Parameter Index" />
            <Input name="parameterSubindex" label="Parameter SubIndex" />
            <ActionButton width="size-2400" onPress={queryMotorParameter}>
              Query
            </ActionButton>
          </Flex>
        </Flex>
        <Flex
          width="size-2400"
          direction="column"
          alignItems="center"
          justifyContent="center"
          gap="size-300"
        >
          <ActionButton width="size-2400" onPress={motorResetErrors}>
            Reset Errors
          </ActionButton>
          <ActionButton width="size-2400" onPress={motorEnable}>
            Enable Motor
          </ActionButton>
          <ActionButton width="size-2400" onPress={motorDisable}>
            Disable Motor
          </ActionButton>
          <ActionButton width="size-2400" onPress={motorCalibrate}>
            Calibrate Motor
          </ActionButton>
        </Flex>
      </Flex>
      <Flex direction="row" alignItems="center" gap="size-100">
        <h1>Motor Data Visualizations</h1>
      </Flex>
      <MotorVisualizations />
    </>
  );
};
