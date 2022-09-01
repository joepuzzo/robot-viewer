import React, { useMemo } from 'react';
import { Flex } from '@adobe/react-spectrum';
import Refresh from '@spectrum-icons/workflow/Refresh';
import ChevronRight from '@spectrum-icons/workflow/ChevronRight';

import { ActionButton } from '@adobe/react-spectrum';

import Switch from '../Informed/Switch';
import InputSlider from '../Informed/InputSlider';
import Select from '../Informed/Select';

// Hooks
import useApp from '../../hooks/useApp';
import useRobotMeta from '../../hooks/useRobotMeta';

import { useFormApi } from 'informed';
import { Waypoints } from './Waypoints';
import useRobotController from '../../hooks/useRobotController';

const triggers = ['x', 'y', 'z', 'r1', 'r2', 'r3'];

export const RobotNav = () => {
  // Get controls for nav and robot config
  const { extraOpen, toggleExtra, setConfig, config } = useApp();

  // Get robot control
  const { updateRobot } = useRobotController();

  // Get robot state
  const { robotOptions } = useRobotMeta();

  console.log('RENDER ROBOT NAV');

  // Grab ranges off of config
  const { rangej0, rangej1, rangej2, rangej3, rangej4, rangej5 } = config;

  // Form api to manipulate form
  const formApi = useFormApi();

  const robotUpdate = () => {
    // Get pos
    const { x, y, z, r1, r2, r3 } = formApi.getFormState().values;

    // Update the robot
    updateRobot(x, y, z, r1, r2, r3);
  };

  const resetRobot = () => {
    formApi.reset();
    formApi.setTheseValues({
      x: 0,
      y: 0,
      z: 16.5,
      r1: 0,
      r2: 0,
      r3: 0,
    });

    robotUpdate();
  };

  const onValueChange =
    (name) =>
    ({ value }) => {
      setConfig((prev) => {
        const newConfig = { ...prev };
        newConfig[name] = value;
        console.log('SETTING', name, 'to', value, 'wtf', triggers.includes(name));

        if (triggers.includes(name)) {
          robotUpdate();
        }

        return newConfig;
      });
    };

  return (
    <>
      <Flex direction="row" alignItems="center" gap="size-100">
        <h1>Robot Viewer</h1>
        {/* <ActionButton
          title="Switch Theme"
          aria-label="Switch Theme"
          onClick={() => toggleColorScheme()}
        >
          <Contrast.default />
        </ActionButton> */}
        <ActionButton title="Reset Robot" aria-label="Reset Robot" onClick={() => resetRobot()}>
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
            <InputSlider
              name="x"
              onNativeChange={onValueChange('x')}
              label="X"
              type="number"
              minValue={-10}
              maxValue={10}
              step={0.1}
              // hideStepper
            />
            <InputSlider
              name="y"
              onNativeChange={onValueChange('y')}
              label="Y"
              type="number"
              minValue={-10}
              maxValue={10}
              step={0.1}
            />
            <InputSlider
              name="z"
              onNativeChange={onValueChange('z')}
              label="Z"
              type="number"
              minValue={-16.5}
              maxValue={16.5}
              step={0.1}
            />
            <InputSlider
              name="r1"
              onNativeChange={onValueChange('r1')}
              label="R1"
              type="number"
              minValue={-180}
              maxValue={180}
              step={1}
            />
            <InputSlider
              name="r2"
              onNativeChange={onValueChange('r2')}
              label="R2"
              type="number"
              minValue={-180}
              maxValue={180}
              step={1}
            />
            <InputSlider
              name="r3"
              onNativeChange={onValueChange('r3')}
              label="R3"
              type="number"
              minValue={-180}
              maxValue={180}
              step={1}
            />
            <InputSlider
              name="j0"
              label="J0"
              type="number"
              minValue={rangej0[0]}
              maxValue={rangej0[1]}
              validateOn="change"
              showErrorIfError
              // minValue={-180}
              // maxValue={180}
              step={1}
            />
            <InputSlider
              name="j1"
              label="J1"
              type="number"
              minValue={rangej1[0]}
              maxValue={rangej1[1]}
              validateOn="change"
              showErrorIfError
              // minValue={-180}
              // maxValue={180}
              step={1}
            />
            <InputSlider
              name="j2"
              label="J2"
              type="number"
              minValue={rangej2[0]}
              maxValue={rangej2[1]}
              validateOn="change"
              showErrorIfError
              // minValue={-180}
              // maxValue={180}
              step={1}
            />
            <InputSlider
              name="j3"
              label="J3"
              type="number"
              minValue={rangej3[0]}
              maxValue={rangej3[1]}
              validateOn="change"
              showErrorIfError
              // minValue={-180}
              // maxValue={180}
              step={1}
            />
            <InputSlider
              name="j4"
              label="J4"
              type="number"
              minValue={rangej4[0]}
              maxValue={rangej4[1]}
              validateOn="change"
              showErrorIfError
              // minValue={-180}
              // maxValue={180}
              step={1}
            />
            <InputSlider
              name="j5"
              label="J5"
              type="number"
              minValue={rangej5[0]}
              maxValue={rangej5[1]}
              validateOn="change"
              showErrorIfError
              // minValue={-180}
              // maxValue={180}
              step={1}
            />
            <InputSlider
              name="base"
              label="Base"
              type="number"
              minValue={0}
              maxValue={5}
              step={0.01}
              trackGradient="black"
            />
            <InputSlider
              name="x0"
              label="X0"
              type="number"
              minValue={0}
              maxValue={5}
              step={0.01}
              trackGradient="black"
            />
            <InputSlider
              name="v0"
              label="V0"
              type="number"
              minValue={0}
              maxValue={5}
              step={0.01}
              trackGradient="red"
            />
            <InputSlider
              name="v1"
              label="V1"
              type="number"
              minValue={0}
              maxValue={5}
              step={0.01}
              trackGradient="green"
            />
            <InputSlider
              name="v2"
              label="V2"
              type="number"
              minValue={0}
              maxValue={5}
              step={0.01}
              trackGradient="blue"
            />
            <InputSlider
              name="v3"
              label="V3"
              type="number"
              minValue={0}
              maxValue={5}
              step={0.01}
              trackGradient="orange"
            />
            <InputSlider
              name="v4"
              label="V4"
              type="number"
              minValue={0}
              maxValue={5}
              step={0.01}
              trackGradient="purple"
            />
            <InputSlider name="v5" label="V5" type="number" minValue={0} maxValue={5} step={0.01} />
            <InputSlider
              name="gridSize"
              initialValue={10}
              label="Grid Size"
              type="number"
              minValue={0}
              maxValue={30}
              step={2}
            />
            <br />
            <Switch name="mainGrid" label="Main Grid" initialValue={true} />
            <br />
            <Switch name="jointGrid" label="Joint Grids" />
            <br />
            <Switch name="hide" label="Hide Robot" />
            <br />
            <Switch name="linkColor" label="Show Link Color" />
            <br />
            <Switch name="hideNegatives" label="Hide Nagatives" />
          </ul>
        </div>
        <div className={extraOpen ? 'sidenav-extra sidenav-extra-visible' : 'sidenav-extra'}>
          <Waypoints />
        </div>
      </Flex>
    </>
  );
};
