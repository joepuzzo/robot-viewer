import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Button, Flex, StatusLight, Tooltip, TooltipTrigger } from '@adobe/react-spectrum';
import Refresh from '@spectrum-icons/workflow/Refresh';
import Graphic from '@spectrum-icons/workflow/Graphic';
import ChevronRight from '@spectrum-icons/workflow/ChevronRight';
import Home from '@spectrum-icons/workflow/Home';
import StopCircle from '@spectrum-icons/workflow/StopCircle';
import Stopwatch from '@spectrum-icons/workflow/Stopwatch';
import AlignCenter from '@spectrum-icons/workflow/AlignCenter';
import LockOpen from '@spectrum-icons/workflow/LockOpen';
import Gauge3 from '@spectrum-icons/workflow/Gauge3';
import Contrast from '@spectrum-icons/workflow/Contrast';
import MoveUpDown from '@spectrum-icons/workflow/MoveUpDown';
import RemoveCircle from '@spectrum-icons/workflow/RemoveCircle';
import MoreVertical from '@spectrum-icons/workflow/MoreVertical';

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
import { RobotType } from '../Shared/RobotType';

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
  const { toggleExtra, config, socket, orbitControl, cameraControl } = useApp();

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
  const { units, zeroPosition, frames } = config;

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

  const motorZero = useCallback((motorId) => {
    const robotId = formApi.getValue('robotId');
    // only send if we are connected
    if (connectedRef.current) {
      socket.emit('motorZero', robotId, motorId);
    }
  }, []);

  const motorReference = useCallback((motorId) => {
    const robotId = formApi.getValue('robotId');
    // only send if we are connected
    if (connectedRef.current) {
      socket.emit('motorReference', robotId, motorId);
    }
  }, []);

  const motorResetErrors = useCallback((motorId) => {
    const robotId = formApi.getValue('robotId');
    // only send if we are connected
    if (connectedRef.current) {
      socket.emit('motorResetErrors', robotId, motorId);
    }
  }, []);

  const motorEnable = useCallback((motorId) => {
    const robotId = formApi.getValue('robotId');
    // only send if we are connected
    if (connectedRef.current) {
      socket.emit('motorEnable', robotId, motorId);
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

  const referenceRobot = () => {
    const robotId = formApi.getValue('robotId');
    stopSimulation();
    // only send if we are connected
    if (connectedRef.current) {
      socket.emit('robotReference', robotId);
    }
  };

  const zeroRobot = () => {
    const robotId = formApi.getValue('robotId');
    stopSimulation();
    // only send if we are connected
    if (connectedRef.current) {
      socket.emit('robotZero', robotId);
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
    orbitControl.current.current.target.set(0, 20, 0);
    cameraControl.current.current.position.set(90, 100, 90);
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

  const onAccelChange = useCallback(({ value }) => {
    const robotId = formApi.getValue('robotId');
    // only send if we are connected
    if (connectedRef.current) {
      socket.emit('robotAccelEnabled', robotId, value);
    }
  }, []);

  // const disabled = !connected;
  const disabled = false;

  return (
    <>
      <Flex direction="row" alignItems="center" gap="size-100">
        <h1>Robot Control</h1>
        <ActionButton title="Reset Robot" aria-label="Reset Robot" onClick={() => resetRobot()}>
          <Refresh />
        </ActionButton>
        <ActionButton title="Freeze" onPress={() => freezeRobot()} isDisabled={disabled}>
          <Stopwatch />
        </ActionButton>
        <TooltipTrigger>
          <ActionButton aria-label="Enable Robot" onPress={() => enable()} isDisabled={disabled}>
            <LockOpen />
          </ActionButton>
          <Tooltip>Enable Robot - This will enable all motors on the robot.</Tooltip>
        </TooltipTrigger>
        <TooltipTrigger>
          <div className="icon-red">
            <ActionButton title="Stop" onPress={() => stop()} isDisabled={disabled}>
              <StopCircle />
            </ActionButton>
          </div>
          <Tooltip>Stop Robot - This will stop all motors on the robot.</Tooltip>
        </TooltipTrigger>
        <ActionButton
          title="Open Waypoints"
          aria-label="Open Waypoints"
          onClick={() => {
            toggleExtra();
            orbitControl.current.current.target.set(0, -40, 0);
            cameraControl.current.current.position.set(90, 110, 90);
          }}
        >
          <ChevronRight />
        </ActionButton>
      </Flex>
      <Flex direction="row" alignItems="center" gap="size-100">
        <TooltipTrigger>
          <ActionButton aria-label="Home Robot" onPress={() => home()} isDisabled={disabled}>
            <Home />
          </ActionButton>
          <Tooltip>Home Robot - This will send all the motors in the robot to home.</Tooltip>
        </TooltipTrigger>
        <TooltipTrigger>
          <ActionButton
            title="Center Robot"
            aria-label="Center Robot"
            onPress={() => centerRobot()}
            isDisabled={disabled}
          >
            <MoreVertical />
          </ActionButton>
          <Tooltip>
            Center Robot - This will send all the motors in the robot to their center position.
          </Tooltip>
        </TooltipTrigger>
        <TooltipTrigger>
          <ActionButton aria-label="Zero Robot" onPress={() => zeroRobot()} isDisabled={disabled}>
            <strong>0</strong>
          </ActionButton>
          <Tooltip>Zero Robot - This will zero out all motors in the robot.</Tooltip>
        </TooltipTrigger>
        <TooltipTrigger>
          <ActionButton
            aria-label="Reference Robot"
            onPress={() => referenceRobot()}
            isDisabled={disabled}
          >
            <AlignCenter />
          </ActionButton>
          <Tooltip>Reference Robot - This will reference all motors in the robot.</Tooltip>
        </TooltipTrigger>
        <TooltipTrigger>
          <ActionButton
            aria-label="Reset Errors"
            onPress={() => resetErrors()}
            isDisabled={disabled}
          >
            <RemoveCircle />
          </ActionButton>
          <Tooltip>Reset Errors - This will reset errors on all motors in the robot.</Tooltip>
        </TooltipTrigger>
        {/* <ActionButton title="Calibrate" onPress={() => calibrate()} isDisabled={disabled}>
          <Compass />
        </ActionButton> */}
        {/* <ActionButton title="Split Home" onPress={() => splitHome()} isDisabled={disabled}>
          <MoveUpDown />
        </ActionButton> */}
        <br />
        <Switch name="runOnRobot" label="Run On Robot" initialValue={false} />
        <br />
        {/* <ActionButton
          title="Switch Theme"
          aria-label="Switch Theme"
          onClick={() => toggleColorScheme()}
        >
          <Contrast />
        </ActionButton> */}
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
            <br />
            <RobotType filter={(robot) => robot.frames && robot.frames.length > 6} />
            <br />
            <Switch
              name="robotAccel"
              label="Robot Acceleration"
              initialValue={true}
              onNativeChange={onAccelChange}
            />
            <Switch name="followrobot" label="Follow Robot" initialValue={false} />
            <br />
            {/* ------------------------- GRIPPER CONTROLS ------------------------- */}
            <hr />
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
            {/* ------------------------- POSITION CONTROLS ------------------------- */}
            <hr />
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
            {/* ------------------------- JOINT CONTROLS ------------------------- */}
            <hr />
            {frames.map((frame, i) => {
              // Dont render control for stationary frame
              if (frame.frameType === 'stationary') {
                return null;
              }
              return (
                <Flex direction="row" alignItems="end" gap="size-100">
                  <InputSlider
                    name={`j${i}`}
                    label={`J${i}`}
                    type="number"
                    minValue={config[`rangej${i}`][0]}
                    maxValue={config[`rangej${i}`][1]}
                    validateOn="change"
                    showErrorIfError
                    onNativeChange={onJointChange(`j${i}`)}
                    step={1}
                  />
                  <ActionButton onPress={() => homeJoint(`j${i}`)}>
                    <Home />
                  </ActionButton>
                  <ActionButton onPress={() => motorReference(`j${i}`)}>
                    <AlignCenter />
                  </ActionButton>
                  <ActionButton onPress={() => motorResetErrors(`j${i}`)}>
                    <RemoveCircle />
                  </ActionButton>
                  <ActionButton onPress={() => motorEnable(`j${i}`)}>
                    <LockOpen />
                  </ActionButton>
                </Flex>
              );
            })}
            <hr />
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
              name="v0"
              label="V1"
              type="number"
              minValue={0}
              maxValue={100}
              step={0.1}
              trackGradient="red"
            />
            <InputSlider
              name="v1"
              label="V2"
              type="number"
              minValue={0}
              maxValue={100}
              step={0.1}
              trackGradient="green"
            />
            <InputSlider
              name="v2"
              label="V3"
              type="number"
              minValue={0}
              maxValue={100}
              step={0.1}
              trackGradient="blue"
            />
            <InputSlider
              name="v3"
              label="V4"
              type="number"
              minValue={0}
              maxValue={100}
              step={0.1}
              trackGradient="orange"
            />
            <InputSlider
              name="v4"
              label="V5"
              type="number"
              minValue={0}
              maxValue={100}
              step={0.1}
              trackGradient="purple"
            />
            <InputSlider name="v5" label="V6" type="number" minValue={0} maxValue={100} step={1} />
            <InputSlider
              name="endEffector"
              label="End Effector"
              type="number"
              minValue={-100}
              maxValue={100}
              defaultValue={0}
              step={1}
              trackGradient="rgb(204, 44, 117)"
            />
            <InputSlider
              name="x0"
              label="X1"
              type="number"
              minValue={0}
              maxValue={100}
              step={0.1}
              trackGradient="black"
            />
            <InputSlider
              name="y0"
              label="Y1"
              type="number"
              minValue={0}
              maxValue={100}
              step={0.1}
              trackGradient="black"
            />
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
            <hr />
            <br />
            <Switch name="mainGrid" label="Main Grid" initialValue={true} />
            <br />
            <Switch name="showLinks" label="Show Links" initialValue={true} />
            <br />
            <Switch name="showCylinder" label="Show Joints" initialValue={true} />
            <br />
            <Switch name="showLines" label="Show Lines" initialValue={true} />
            <br />
            <Switch name="showConnections" label="Show Connections" initialValue={false} />
            <br />
            <Switch name="showArrows" label="Show Arrows" initialValue={false} />
            <br />
            <Switch name="jointGrid" label="Joint Grids" />
            <br />
            <Switch name="hide" label="Hide Robot" initialValue={false} />
            <br />
            <Switch name="linkColor" label="Show Link Color" />
            <br />
            <Switch name="hideNegatives" label="Hide Nagatives" />
            <br />
            <Switch name="showPlanes" label="Show Planes" initialValue={false} />
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
      </Flex>
    </>
  );
};
