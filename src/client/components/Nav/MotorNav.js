import React, { useMemo } from 'react';
import { ActionButton, Flex } from '@adobe/react-spectrum';
import Home from '@spectrum-icons/workflow/Home';
import ChevronRight from '@spectrum-icons/workflow/ChevronRight';
import useApp from '../../hooks/useApp';
import Select from '../Informed/Select';
import { Debug, useFieldState } from 'informed';
import useRobotMeta from '../../hooks/useRobotMeta';

export const MotorNav = () => {
  console.log('RENDER MOTOR NAV');

  // Get controls for nav
  const { extraOpen, toggleExtra } = useApp();

  // Get robot state
  const { robotOptions, robots } = useRobotMeta();

  // Get value of robotId
  const { value: robotId } = useFieldState('robotId');

  // Build options for motor select
  const motorOptions = useMemo(() => {
    const selectedRobot = robots[robotId];
    if (selectedRobot && selectedRobot.motors) {
      return Object.values(selectedRobot.motors).map((motor) => {
        return {
          value: motor.id,
          label: `Motor-${motor.id}`,
        };
      });
    }
    return [];
  }, [robotId, robots]);

  const homeRobot = () => {};

  return (
    <>
      <Flex direction="row" alignItems="center" gap="size-100">
        <h1>Motor Viewer</h1>
        <ActionButton title="Home Robot" aria-label="Home Robot" onClick={() => homeRobot()}>
          <Home.default />
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
