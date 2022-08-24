import React, { useMemo } from 'react';
import { ActionButton, Flex } from '@adobe/react-spectrum';
import Refresh from '@spectrum-icons/workflow/Refresh';
import ChevronRight from '@spectrum-icons/workflow/ChevronRight';
import useApp from '../../hooks/useApp';
import NumberInput from '../Informed/NumberInput';
import Select from '../Informed/Select';
import { Debug, useFieldState } from 'informed';

export const MotorNav = () => {
  const { extraOpen, toggleExtra, robots } = useApp();

  const { value: robotId } = useFieldState('robotId');

  const robotOptions = useMemo(() => {
    const robotsArray = Object.values(robots);
    return robotsArray.map((robot) => {
      return {
        value: robot.id,
        label: `Robot-${robot.id}`,
      };
    });
  }, [robots]);

  const motorOptions = useMemo(() => {
    const selectedRobot = robots[robotId];
    if (selectedRobot) {
      return Object.values(selectedRobot.motors).map((motor) => {
        return {
          value: motor.id,
          label: `Motor-${motor.id}`,
        };
      });
    }
    return [];
  }, [robotId]);

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
            <Select
              label="Robot"
              name="robotId"
              defaultValue="na"
              aria-label="Robot"
              options={[{ value: 'na', label: 'Disconnect' }, ...robotOptions]}
            />
            <Select
              label="Motor"
              name="motorId"
              defaultValue="na"
              aria-label="Motor"
              options={[{ value: 'na', label: 'Disconnect' }, ...motorOptions]}
            />
            <Debug values />
          </ul>
        </div>
        <div className={extraOpen ? 'sidenav-extra sidenav-extra-visible' : 'sidenav-extra'}></div>
      </Flex>
    </>
  );
};
