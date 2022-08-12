import React from 'react';
import { ActionButton, Flex } from '@adobe/react-spectrum';
import Refresh from '@spectrum-icons/workflow/Refresh';
import ChevronRight from '@spectrum-icons/workflow/ChevronRight';
import useApp from '../../hooks/useApp';
import NumberInput from '../Informed/NumberInput';

export const MotorNav = () => {
  const { extraOpen, toggleExtra } = useApp();

  const resetMotor = () => {};

  return (
    <>
      <Flex direction="row" alignItems="center" gap="size-100">
        <h1>Motor Viewer</h1>

        <ActionButton title="Reset Motor" aria-label="Reset Motor" onClick={() => resetMotor()}>
          <Refresh.default />
        </ActionButton>
        <ActionButton
          title="Open Waypoints"
          aria-label="Open Waypoints"
          onClick={() => toggleExtra()}
        >
          <ChevronRight.default />
        </ActionButton>
      </Flex>
      <Flex direction="row" gap="size-500">
        <div className="sidenav-controls">
          <ul className="spectrum-SideNav">
            <NumberInput name="robotId" label="Robot" type="number" initialValue={1} hideStepper />
            <NumberInput name="motorId" label="Motor" type="number" initialValue={16} hideStepper />
          </ul>
        </div>
        <div className={extraOpen ? 'sidenav-extra sidenav-extra-visible' : 'sidenav-extra'}></div>
      </Flex>
    </>
  );
};
