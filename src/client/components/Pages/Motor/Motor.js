import { useFormApi, useFormState } from 'informed';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import useApp from '../../../hooks/useApp';
import InputSlider from '../../Informed/InputSlider';
import Alert from '@spectrum-icons/workflow/Alert';
import { Flex } from '@adobe/react-spectrum';

export const Motor = () => {
  const { socket } = useApp();

  const { values } = useFormState();
  const formApi = useFormApi();

  const [motorState, setMotorState] = useState({});
  const [connected, setConnected] = useState(false);

  const { motorSetPos } = values;

  const controlRef = useRef();

  useEffect(() => {
    const stateHandler = (update) => {
      const motorId = formApi.getValue('motorId');
      const index = update.indexMap[motorId];
      const state = update.motors[index];
      setMotorState(state);
    };

    const connectedHandler = (id) => {
      console.log('Robot Connect', id);
      if (id == formApi.getFormState().values.robotId) {
        formApi.setError('robotId', undefined);
        formApi.setError('motorId', undefined);
        setConnected(true);
      }
    };

    const disconnectedHandler = (id) => {
      console.log('Robot Disconnect', id);
      if (id == formApi.getFormState().values.robotId) {
        formApi.setError('robotId', 'Disconnected');
        formApi.setError('motorId', 'Disconnected');
        setConnected(false);
      }
    };

    socket.on('robot', stateHandler);
    socket.on('robotConnected', connectedHandler);
    socket.on('robotDisconnected', disconnectedHandler);

    return () => {
      socket.removeListener('robot', stateHandler);
      socket.removeListener('robotConnected', connectedHandler);
      socket.removeListener('robotDisconnected', disconnectedHandler);
    };
  }, []);

  const setMotorPos = useCallback(({ value }) => {
    const motorId = formApi.getValue('motorId');
    const robotId = formApi.getValue('robotId');
    socket.emit('setMotorPos', robotId, motorId, value);
  }, []);

  return (
    <>
      <Flex direction="row" alignItems="center" gap="size-100">
        <h1>Motor Controller</h1>
        {!connected ? <Alert.default aria-label="Negative Alert" color="negative" /> : null}
      </Flex>
      <InputSlider
        name="motorSetPos"
        label="Set Position"
        onValueChange={setMotorPos}
        type="number"
        minValue={-180}
        maxValue={180}
        initialValue={0}
        step={1}
        trackGradient="rgb(107,18,10)"
      />
      <svg width="500" height="500">
        <g transform={`rotate(${motorSetPos ?? 0} 250 250)`}>
          <circle cx="250" cy="250" r="200" fill="grey" stroke="rgb(107,18,10)" strokeWidth="20" />
          <circle ref={controlRef} cx="250" cy="100" r="20" fill="black" />
        </g>
      </svg>
      <div>
        <pre>{JSON.stringify(motorState, null, 2)}</pre>
      </div>
    </>
  );
};
