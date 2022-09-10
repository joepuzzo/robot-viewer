import React, { useCallback, useMemo, useRef } from 'react';
import { Flex, StatusLight } from '@adobe/react-spectrum';
import Refresh from '@spectrum-icons/workflow/Refresh';
import ChevronRight from '@spectrum-icons/workflow/ChevronRight';
import Home from '@spectrum-icons/workflow/Home';
import StopCircle from '@spectrum-icons/workflow/StopCircle';
import AlignCenter from '@spectrum-icons/workflow/AlignCenter';
import LockOpen from '@spectrum-icons/workflow/LockOpen';

import { ActionButton } from '@adobe/react-spectrum';

import Switch from '../Informed/Switch';
import InputSlider from '../Informed/InputSlider';
import Select from '../Informed/Select';

// Hooks
import useApp from '../../hooks/useApp';
import useRobotMeta from '../../hooks/useRobotMeta';

import { useFieldState, useFormApi } from 'informed';
import { Waypoints } from './Waypoints';
import useRobotController from '../../hooks/useRobotController';
import useRobotKinematics from '../../hooks/useRobotKinematics';

const triggers = ['x', 'y', 'z', 'r1', 'r2', 'r3'];

export const RobotNav = () => {
  // Get controls for nav and robot config
  const { extraOpen, toggleExtra, setConfig, config, socket } = useApp();

  // Get robot control
  const { updateRobot, updateJoint } = useRobotController();

  // Get Kinimatics

  const { updateForward } = useRobotKinematics();

  // Get the selected robot
  const { value: selectedRobot } = useFieldState('robotId');

  // Get robot state
  const { robotOptions, connected, robots } = useRobotMeta();

  const connectedRef = useRef();
  connectedRef.current = connected;

  // Get selected robot meta
  const selectedRobotMeta = robots && robots[selectedRobot];

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

  const homeJoint = useCallback((motorId) => {
    const robotId = formApi.getValue('robotId');
    // only send if we are connected
    if (connectedRef.current) {
      socket.emit('motorHome', robotId, motorId);
    }
  }, []);

  const centerJoint = (name) => {
    updateJoint(name, 0);
  };

  const stop = () => {
    const robotId = formApi.getValue('robotId');
    // only send if we are connected
    if (connectedRef.current) {
      socket.emit('robotStop', robotId);
    }
  };

  const enable = () => {
    const robotId = formApi.getValue('robotId');
    // only send if we are connected
    if (connectedRef.current) {
      socket.emit('robotEnable', robotId);
    }
  };

  const home = () => {
    const robotId = formApi.getValue('robotId');
    // only send if we are connected
    if (connectedRef.current) {
      socket.emit('robotHome', robotId);
    }
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

  const onJointChange =
    (name) =>
    ({ value }) => {
      updateJoint(name, value);
      updateForward();
    };

  const disabled = !connected;

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
        <ActionButton title="Enable" onPress={() => home()} isDisabled={disabled}>
          <Home.default />
        </ActionButton>
        <ActionButton title="Enable" onPress={() => enable()} isDisabled={disabled}>
          <LockOpen.default />
        </ActionButton>
        <div className="icon-red">
          <ActionButton title="Stop" onPress={() => stop()} isDisabled={disabled}>
            <StopCircle.default />
          </ActionButton>
        </div>
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
            <Flex direction="row" alignItems="center" gap="size-100">
              {connected && !selectedRobotMeta?.stopped ? (
                <StatusLight variant="positive">Enabled</StatusLight>
              ) : null}
              {connected && selectedRobotMeta?.stopped ? (
                <StatusLight variant="negative">Disabled</StatusLight>
              ) : null}
              {connected && !selectedRobotMeta?.home ? (
                <StatusLight variant="negative">Home</StatusLight>
              ) : null}
              {connected && selectedRobotMeta?.home ? (
                <StatusLight variant="positive">Home</StatusLight>
              ) : null}
              {connected && !selectedRobotMeta?.homing ? (
                <StatusLight variant="negative">Homing</StatusLight>
              ) : null}
              {connected && selectedRobotMeta?.homing ? (
                <StatusLight variant="positive">Homing</StatusLight>
              ) : null}
            </Flex>
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
              minValue={-20}
              maxValue={20}
              step={0.1}
              // hideStepper
            />
            <InputSlider
              name="y"
              onNativeChange={onValueChange('y')}
              label="Y"
              type="number"
              minValue={-20}
              maxValue={20}
              step={0.1}
            />
            <InputSlider
              name="z"
              onNativeChange={onValueChange('z')}
              label="Z"
              type="number"
              minValue={-18}
              maxValue={18}
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
            <Flex direction="row" alignItems="end" gap="size-100">
              <InputSlider
                name="j0"
                label="J1"
                type="number"
                minValue={rangej0[0]}
                maxValue={rangej0[1]}
                validateOn="change"
                showErrorIfError
                onNativeChange={onJointChange('j0')}
                // minValue={-180}
                // maxValue={180}
                step={1}
              />
              <ActionButton onPress={() => homeJoint('j0')}>
                <Home.default />
              </ActionButton>
              <ActionButton onPress={() => centerJoint('j0')}>
                <AlignCenter.default />
              </ActionButton>
            </Flex>
            <Flex direction="row" alignItems="end" gap="size-100">
              <InputSlider
                name="j1"
                label="J2"
                type="number"
                minValue={rangej1[0]}
                maxValue={rangej1[1]}
                validateOn="change"
                showErrorIfError
                onNativeChange={onJointChange('j1')}
                // minValue={-180}
                // maxValue={180}
                step={1}
              />
              <ActionButton onPress={() => homeJoint('j1')}>
                <Home.default />
              </ActionButton>
              <ActionButton onPress={() => centerJoint('j1')}>
                <AlignCenter.default />
              </ActionButton>
            </Flex>
            <Flex direction="row" alignItems="end" gap="size-100">
              <InputSlider
                name="j2"
                label="J3"
                type="number"
                minValue={rangej2[0]}
                maxValue={rangej2[1]}
                validateOn="change"
                showErrorIfError
                onNativeChange={onJointChange('j2')}
                // minValue={-180}
                // maxValue={180}
                step={1}
              />
              <ActionButton onPress={() => homeJoint('j2')}>
                <Home.default />
              </ActionButton>
              <ActionButton onPress={() => centerJoint('j2')}>
                <AlignCenter.default />
              </ActionButton>
            </Flex>
            <Flex direction="row" alignItems="end" gap="size-100">
              <InputSlider
                name="j3"
                label="J4"
                type="number"
                minValue={rangej3[0]}
                maxValue={rangej3[1]}
                validateOn="change"
                showErrorIfError
                onNativeChange={onJointChange('j3')}
                // minValue={-180}
                // maxValue={180}
                step={1}
              />
              <ActionButton onPress={() => homeJoint('j3')}>
                <Home.default />
              </ActionButton>
              <ActionButton onPress={() => centerJoint('j3')}>
                <AlignCenter.default />
              </ActionButton>
            </Flex>
            <Flex direction="row" alignItems="end" gap="size-100">
              <InputSlider
                name="j4"
                label="J5"
                type="number"
                minValue={rangej4[0]}
                maxValue={rangej4[1]}
                validateOn="change"
                showErrorIfError
                onNativeChange={onJointChange('j4')}
                // minValue={-180}
                // maxValue={180}
                step={1}
              />
              <ActionButton onPress={() => homeJoint('j4')}>
                <Home.default />
              </ActionButton>
              <ActionButton onPress={() => centerJoint('j4')}>
                <AlignCenter.default />
              </ActionButton>
            </Flex>
            <Flex direction="row" alignItems="end" gap="size-100">
              <InputSlider
                name="j5"
                label="J6"
                type="number"
                minValue={rangej5[0]}
                maxValue={rangej5[1]}
                validateOn="change"
                showErrorIfError
                onNativeChange={onJointChange('j5')}
                // minValue={-180}
                // maxValue={180}
                step={1}
              />
              <ActionButton onPress={() => homeJoint('j5')}>
                <Home.default />
              </ActionButton>
              <ActionButton onPress={() => centerJoint('j5')}>
                <AlignCenter.default />
              </ActionButton>
            </Flex>

            <InputSlider
              name="base"
              label="Base"
              type="number"
              minValue={0}
              maxValue={10}
              step={0.01}
              trackGradient="black"
            />
            <InputSlider
              name="x0"
              label="X0"
              type="number"
              minValue={0}
              maxValue={10}
              step={0.01}
              trackGradient="black"
            />
            <InputSlider
              name="v0"
              label="V0"
              type="number"
              minValue={0}
              maxValue={10}
              step={0.01}
              trackGradient="red"
            />
            <InputSlider
              name="v1"
              label="V1"
              type="number"
              minValue={0}
              maxValue={10}
              step={0.01}
              trackGradient="green"
            />
            <InputSlider
              name="v2"
              label="V2"
              type="number"
              minValue={0}
              maxValue={10}
              step={0.01}
              trackGradient="blue"
            />
            <InputSlider
              name="v3"
              label="V3"
              type="number"
              minValue={0}
              maxValue={10}
              step={0.01}
              trackGradient="orange"
            />
            <InputSlider
              name="v4"
              label="V4"
              type="number"
              minValue={0}
              maxValue={10}
              step={0.01}
              trackGradient="purple"
            />
            <InputSlider
              name="v5"
              label="V5"
              type="number"
              minValue={0}
              maxValue={10}
              step={0.01}
            />
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
