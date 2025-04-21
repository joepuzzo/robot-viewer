import React, { useCallback, useRef } from 'react';
import { ActionButton, Flex } from '@adobe/react-spectrum';
import ChevronRight from '@spectrum-icons/workflow/ChevronRight';
import useApp from '../../hooks/useApp';
import Select from '../Informed/Select';
import { Debug, useFieldState, useFormApi } from 'informed';
import useRobotMeta from '../../hooks/useRobotMeta';
import Switch from '../Informed/Switch';
import useRobotController from '../../hooks/useRobotController';

export const CookbookNav = () => {
  console.log('RENDER CookBook NAV');

  // Get controls for nav
  const { extraOpen, toggleExtra } = useApp();

  // Get robot state
  const { robotOptions, robots, connected } = useRobotMeta();

  // Get robot control
  const { updateConfig } = useRobotController();

  // Get value of robotId
  const { value: robotId } = useFieldState('robotId');

  // Form api to manipulate form
  const formApi = useFormApi();

  // Ref to use in functions for if robot is connected
  const connectedRef = useRef();
  connectedRef.current = connected;

  const onAccelChange = useCallback(({ value }) => {
    const motorId = formApi.getValue('motorId');
    // only send if we are connected and have selected motor
    if (connectedRef.current && motorId != 'na') {
      updateConfig(`${motorId}.accelEnabled`, value);
    }
  }, []);

  return (
    <>
      <Flex direction="row" alignItems="center" gap="size-100">
        <h1>Cookbook</h1>
        <ActionButton onClick={() => toggleExtra()}>
          <ChevronRight />
        </ActionButton>
      </Flex>
      <Flex direction="row" gap="size-500">
        <div className="sidenav-controls">
          <ul className="spectrum-SideNav">
            <Select
              label="Robot"
              name="robotId"
              defaultValue="na"
              aria-label="Robot"
              options={[{ value: 'na', label: 'Disconnect' }, ...robotOptions]}
            />
            <br />
            <br />
            <Switch
              name="motorAccel"
              label="Motor Acceleration"
              initialValue={false}
              onNativeChange={onAccelChange}
            />
          </ul>
        </div>
        <div className={extraOpen ? 'sidenav-extra sidenav-extra-visible' : 'sidenav-extra'}></div>
      </Flex>
    </>
  );
};
