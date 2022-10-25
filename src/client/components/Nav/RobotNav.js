import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Button, Flex, StatusLight } from '@adobe/react-spectrum';
import Refresh from '@spectrum-icons/workflow/Refresh';
import ChevronRight from '@spectrum-icons/workflow/ChevronRight';
import Home from '@spectrum-icons/workflow/Home';
import StopCircle from '@spectrum-icons/workflow/StopCircle';
import Stopwatch from '@spectrum-icons/workflow/Stopwatch';
import AlignCenter from '@spectrum-icons/workflow/AlignCenter';
import LockOpen from '@spectrum-icons/workflow/LockOpen';
import Compass from '@spectrum-icons/workflow/Compass';
import MoveUpDown from '@spectrum-icons/workflow/MoveUpDown';
import RemoveCircle from '@spectrum-icons/workflow/RemoveCircle';

import { ActionButton } from '@adobe/react-spectrum';

import Switch from '../Informed/Switch';
import InputSlider from '../Informed/InputSlider';
import NumberInput from '../Informed/NumberInput';

import Select from '../Informed/Select';

// Hooks
import useApp from '../../hooks/useApp';
import useRobotMeta from '../../hooks/useRobotMeta';

import { useFieldState, useFormApi } from 'informed';
import { Waypoints } from './Waypoints';
import useRobotController from '../../hooks/useRobotController';
import useRobotKinematics from '../../hooks/useRobotKinematics';
import useSimulateController from '../../hooks/useSimulateController';

const triggers = ['x', 'y', 'z', 'r1', 'r2', 'r3'];

// Helper status component -----------------------------
const Status = ({ status, posText, negText, text }) => {
  const { connected } = useRobotMeta();

  if (!connected) {
    return null;
  }

  if (status) {
    return (
      <StatusLight variant="positive" maxWidth={100}>
        {posText ?? text}
      </StatusLight>
    );
  } else {
    return (
      <StatusLight variant="negative" maxWidth={100}>
        {negText ?? text}
      </StatusLight>
    );
  }
};

// Robot Nav -----------------------------
export const RobotNav = () => {
  // Get controls for nav and robot config
  const { extraOpen, toggleExtra, config, socket, robotTypes, selectRobot } = useApp();

  // Get robot control
  const { updateRobot, updateJoint, updateConfig, saveConfig, updateGripper } =
    useRobotController();

  // Get simulate controls
  const { stop: stopSimulation } = useSimulateController();

  // Get Kinimatics
  const { updateForward } = useRobotKinematics();

  // Form api to manipulate form
  const formApi = useFormApi();

  // Get the selected robot
  const { value: selectedRobot } = useFieldState('robotId');

  // Get robot state
  const { robotOptions, connected, robots } = useRobotMeta();

  const connectedRef = useRef();
  connectedRef.current = connected;

  // Get selected robot meta
  const selectedRobotMeta = robots && robots[selectedRobot];

  const robotTypeOptions = useMemo(() => {
    if (robotTypes) {
      return Object.keys(robotTypes).map((t) => {
        return { value: t, label: t };
      });
    }
    return [];
  }, [robotTypes]);

  // Update some fields when the selected robot changes
  useEffect(() => {
    if (selectedRobotMeta) {
      formApi.setTheseValues({
        j0_limitAdj: selectedRobotMeta.config?.j0?.limitAdj ?? 0,
        j1_limitAdj: selectedRobotMeta.config?.j1?.limitAdj ?? 0,
        j2_limitAdj: selectedRobotMeta.config?.j2?.limitAdj ?? 0,
        j3_limitAdj: selectedRobotMeta.config?.j3?.limitAdj ?? 0,
        j4_limitAdj: selectedRobotMeta.config?.j4?.limitAdj ?? 0,
        j5_limitAdj: selectedRobotMeta.config?.j5?.limitAdj ?? 0,
      });
    }
  }, [selectedRobotMeta]);

  console.log('RENDER ROBOT NAV');

  // Grab ranges off of config
  const { rangej0, rangej1, rangej2, rangej3, rangej4, rangej5, units, zeroPosition } = config;

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
    stopSimulation();
    // only send if we are connected
    if (connectedRef.current) {
      socket.emit('robotStop', robotId);
    }
  };

  const freezeRobot = () => {
    const robotId = formApi.getValue('robotId');
    stopSimulation();
    // only send if we are connected
    if (connectedRef.current) {
      socket.emit('robotFreeze', robotId);
    }
  };

  const centerRobot = () => {
    const robotId = formApi.getValue('robotId');
    formApi.setTheseValues({
      j0: 0,
      j1: 0,
      j2: 0,
      j3: 0,
      j4: 0,
      j5: 0,
    });
    // only send if we are connected
    if (connectedRef.current) {
      socket.emit('robotCenter', robotId);
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

  const splitHome = () => {
    const robotId = formApi.getValue('robotId');
    // only send if we are connected
    if (connectedRef.current) {
      socket.emit('robotSplitHome', robotId);
    }
  };

  const calibrate = () => {
    const robotId = formApi.getValue('robotId');
    // only send if we are connected
    if (connectedRef.current) {
      socket.emit('robotCalibrate', robotId);
    }
  };

  const resetErrors = () => {
    const robotId = formApi.getValue('robotId');
    // only send if we are connected
    if (connectedRef.current) {
      socket.emit('robotResetErrors', robotId);
    }
  };

  const resetRobot = () => {
    formApi.reset();
    formApi.setTheseValues({
      x: zeroPosition[0],
      y: zeroPosition[1],
      z: zeroPosition[2],
      r1: 0,
      r2: 0,
      r3: 0,
    });

    robotUpdate();
  };

  const onValueChange = (name) => () => {
    if (triggers.includes(name)) {
      robotUpdate();
    }
  };

  const onJointChange =
    (name) =>
    ({ value }) => {
      updateJoint(name, value);
      updateForward();
    };

  const onGripperChange = ({ value }) => {
    updateGripper(value);
  };

  const gripperOpenChange = ({ value }) => {
    if (value) {
      updateGripper(60);
      formApi.setValue('gripper', 60);
    } else {
      updateGripper(20);
      formApi.setValue('gripper', 20);
    }
  };

  const onConfigChange =
    (key) =>
    ({ value }) => {
      // Example key = "j0.limitAdj"
      updateConfig(key, value);
    };

  const disabled = !connected;

  return (
    <>
      <Flex direction="row" alignItems="center" gap="size-100">
        <h1>Robot Control</h1>
        <ActionButton title="Reset Robot" aria-label="Reset Robot" onClick={() => resetRobot()}>
          <Refresh.default />
        </ActionButton>
        <ActionButton title="Freeze" onPress={() => freezeRobot()} isDisabled={disabled}>
          <Stopwatch.default />
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
      <Flex direction="row" alignItems="center" gap="size-100">
        <ActionButton title="Enable" onPress={() => home()} isDisabled={disabled}>
          <Home.default />
        </ActionButton>
        <ActionButton
          title="Center Robot"
          aria-label="Center Robot"
          onPress={() => centerRobot()}
          isDisabled={disabled}
        >
          <AlignCenter.default />
        </ActionButton>
        {/* <ActionButton title="Calibrate" onPress={() => calibrate()} isDisabled={disabled}>
          <Compass.default />
        </ActionButton> */}
        <ActionButton title="Split Home" onPress={() => splitHome()} isDisabled={disabled}>
          <MoveUpDown.default />
        </ActionButton>
        <ActionButton title="Split Home" onPress={() => resetErrors()} isDisabled={disabled}>
          <RemoveCircle.default />
        </ActionButton>
        <br />
        <Switch name="runOnRobot" label="Run On Robot" initialValue={true} />
        <br />
      </Flex>
      <Flex direction="row" gap="size-500">
        <div className="sidenav-controls">
          <ul className="spectrum-SideNav">
            <Flex direction="row" alignItems="center" gap="size-100">
              <Status status={!selectedRobotMeta?.stopped} posText="Enabled" negText="Disabled" />
              <Status status={selectedRobotMeta?.home} text="Home" />
              <Status status={selectedRobotMeta?.homing} text="Homing" />
              <Status status={selectedRobotMeta?.moving} text="Moving" />
            </Flex>
            <Select
              label="Robot"
              name="robotId"
              defaultValue="na"
              aria-label="Robot"
              options={[{ value: 'na', label: 'Disconnect' }, ...robotOptions]}
            />
            <Select
              label="Robot Type"
              name="robotType"
              defaultValue="Example"
              onNativeChange={selectRobot}
              options={[...robotTypeOptions]}
            />
            <Flex direction="row" alignItems="end" gap="size-100">
              <InputSlider
                name="gripper"
                onNativeChange={onGripperChange}
                label={`Gripper`}
                type="number"
                minValue={20}
                maxValue={60}
                initialValue={20}
                step={1}
              />
              <br />
              <Switch
                name="gripperOpen"
                label="Open"
                initialValue={false}
                onNativeChange={gripperOpenChange}
              />
              <br />
            </Flex>
            <InputSlider
              name="x"
              onNativeChange={onValueChange('x')}
              label={`X ${units}`}
              type="number"
              minValue={-200}
              maxValue={200}
              step={1}
              // hideStepper
            />
            <InputSlider
              name="y"
              onNativeChange={onValueChange('y')}
              label={`Y ${units}`}
              type="number"
              minValue={-200}
              maxValue={200}
              step={1}
            />
            <InputSlider
              name="z"
              onNativeChange={onValueChange('z')}
              label={`Z ${units}`}
              type="number"
              minValue={-200}
              maxValue={200}
              step={1}
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
              maxValue={100}
              step={0.1}
              trackGradient="black"
            />
            <InputSlider
              name="x0"
              label="X0"
              type="number"
              minValue={0}
              maxValue={100}
              step={0.1}
              trackGradient="black"
            />
            <InputSlider
              name="y0"
              label="Y0"
              type="number"
              minValue={0}
              maxValue={100}
              step={0.1}
              trackGradient="black"
            />
            <InputSlider
              name="v0"
              label="V0"
              type="number"
              minValue={0}
              maxValue={100}
              step={0.1}
              trackGradient="red"
            />
            <InputSlider
              name="v1"
              label="V1"
              type="number"
              minValue={0}
              maxValue={100}
              step={0.1}
              trackGradient="green"
            />
            <InputSlider
              name="v2"
              label="V2"
              type="number"
              minValue={0}
              maxValue={100}
              step={0.1}
              trackGradient="blue"
            />
            <InputSlider
              name="v3"
              label="V3"
              type="number"
              minValue={0}
              maxValue={100}
              step={0.1}
              trackGradient="orange"
            />
            <InputSlider
              name="v4"
              label="V4"
              type="number"
              minValue={0}
              maxValue={100}
              step={0.1}
              trackGradient="purple"
            />
            <InputSlider name="v5" label="V5" type="number" minValue={0} maxValue={100} step={1} />
            <InputSlider
              name="gridSize"
              initialValue={100}
              label="Grid Size"
              type="number"
              minValue={0}
              maxValue={300}
              step={10}
            />
            <br />
            <Switch name="mainGrid" label="Main Grid" initialValue={true} />
            <br />
            <Switch name="jointGrid" label="Joint Grids" />
            <br />
            <Switch name="hide" label="Hide Robot" initialValue={false} />
            <br />
            <Switch name="linkColor" label="Show Link Color" />
            <br />
            <Switch name="hideNegatives" label="Hide Nagatives" />
            <br />
            <hr />
            <h2>Robot Config</h2>
            <NumberInput
              name="j0_limitAdj"
              label="J1 Limit Adjustment"
              step={0.1}
              initialValue={0}
              onNativeChange={onConfigChange('j0.limitAdj')}
            />
            <NumberInput
              name="j1_limitAdj"
              label="J2 Limit Adjustment"
              step={0.1}
              initialValue={0}
              onNativeChange={onConfigChange('j1.limitAdj')}
            />
            <NumberInput
              name="j2_limitAdj"
              label="J3 Limit Adjustment"
              step={0.1}
              initialValue={0}
              onNativeChange={onConfigChange('j2.limitAdj')}
            />
            <NumberInput
              name="j3_limitAdj"
              label="J4 Limit Adjustment"
              step={0.1}
              initialValue={0}
              onNativeChange={onConfigChange('j3.limitAdj')}
            />
            <NumberInput
              name="j4_limitAdj"
              label="J5 Limit Adjustment"
              step={0.1}
              initialValue={0}
              onNativeChange={onConfigChange('j4.limitAdj')}
            />
            <NumberInput
              name="j5_limitAdj"
              label="J6 Limit Adjustment"
              step={0.1}
              initialValue={0}
              onNativeChange={onConfigChange('j5.limitAdj')}
            />
            <br />
            <br />
            <Button variant="cta" type="button" onPress={saveConfig}>
              Save Config
            </Button>
            <br />
            <br />
            <br />
          </ul>
        </div>
        <div className={extraOpen ? 'sidenav-extra sidenav-extra-visible' : 'sidenav-extra'}>
          <Waypoints />
        </div>
      </Flex>
    </>
  );
};
