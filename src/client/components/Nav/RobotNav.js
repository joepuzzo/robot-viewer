import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Button,
  Cell,
  Column,
  Content,
  ContextualHelp,
  Flex,
  Heading,
  Row,
  StatusLight,
  TableBody,
  TableHeader,
  TableView,
  Text,
  Tooltip,
  TooltipTrigger,
} from '@adobe/react-spectrum';
import Refresh from '@spectrum-icons/workflow/Refresh';
import Graphic from '@spectrum-icons/workflow/Graphic';
import RailRightClose from '@spectrum-icons/workflow/RailRightClose';
import RailRightOpen from '@spectrum-icons/workflow/RailRightOpen';
import Sync from '@spectrum-icons/workflow/Sync';
import ChevronRight from '@spectrum-icons/workflow/ChevronRight';
import Home from '@spectrum-icons/workflow/Home';
import StopCircle from '@spectrum-icons/workflow/StopCircle';
import Stopwatch from '@spectrum-icons/workflow/Stopwatch';
import AlignCenter from '@spectrum-icons/workflow/AlignCenter';
import LockOpen from '@spectrum-icons/workflow/LockOpen';
import LockClosed from '@spectrum-icons/workflow/LockClosed';
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
import { If } from '../Shared/If';
import Input from '../Informed/Input';
import { TYPE_MAPPING } from '../../constants';
import { round } from '../../../lib/round';

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
  const { toggleExtra, config, socket, orbitControl, cameraControl, toggleColorScheme } = useApp();

  // Get features off config
  const { features } = config;

  // Get robot control
  const { updateRobot, updateJoint, updateJoints, updateConfig, saveConfig, updateGripper } =
    useRobotController();

  // Get simulate controls
  const { stop: stopSimulation } = useSimulateController();

  // Get Kinimatics
  const { updateForward } = useRobotKinematics();

  // Form api to manipulate form
  const formApi = useFormApi();

  // Get the selected robot
  const { value: selectedRobot } = useFieldState('robotId');

  // Used to toggle on and off cart floating axis
  const [cartFloatingAxis, setCartFloatingAxis] = useState({
    x: false,
    y: false,
    z: false,
    rx: false,
    ry: false,
    rz: false,
  });

  const toggleAxis = (axis) => {
    setCartFloatingAxis((prevState) => ({
      ...prevState,
      [axis]: !prevState[axis],
    }));
  };

  // Get robot state
  const { robotOptions, connected, robots, getRobotState } = useRobotMeta();

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

  const motorDisable = useCallback((motorId) => {
    const robotId = formApi.getValue('robotId');
    // only send if we are connected
    if (connectedRef.current) {
      socket.emit('motorDisable', robotId, motorId);
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

  const ftZeroRobot = () => {
    const robotId = formApi.getValue('robotId');
    stopSimulation();
    // only send if we are connected
    if (connectedRef.current) {
      socket.emit('robotZeroFT', robotId);
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

  const enableFreedrive = () => {
    const { freedriveFrame, robotId, nullspace } = formApi.getFormState().values;
    // only send if we are connected
    if (connectedRef.current) {
      socket.emit('robotFreedriveEnable', robotId, freedriveFrame, cartFloatingAxis, nullspace);
    }
  };

  const disableFreedrive = () => {
    const robotId = formApi.getValue('robotId');
    // only send if we are connected
    if (connectedRef.current) {
      socket.emit('robotFreedriveDisable', robotId);
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
    const { gripperVelocity, gripperForce } = formApi.getFormState().values;
    updateGripper(value, gripperVelocity, gripperForce);
  };

  const gripperOpen = () => {
    const { gripperOpened, gripperVelocity, gripperForce } = formApi.getFormState().values;
    updateGripper(gripperOpened, gripperVelocity, gripperForce);
    formApi.setValue('gripper', gripperOpened);
  };

  const gripperClose = () => {
    const { gripperClosed, gripperVelocity, gripperForce } = formApi.getFormState().values;
    updateGripper(gripperClosed, gripperVelocity, gripperForce);
    formApi.setValue('gripper', gripperClosed);
  };

  const gripperSet = ({ width, vel, force }) => {
    formApi.setTheseValues({
      gripper: width,
      gripperVelocity: vel,
      gripperForce: force,
    });

    updateGripper(width, vel, force);
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

  const setAllJoints = useCallback(() => {
    // Get the value of the form state
    const { jointsString } = formApi.getFormState().values;
    // Take the joint string and convert it to an array of numbers to set angles too
    const angles = jointsString.split(' ').map((a) => +a);
    // TODO make this based on frames maybe
    if (angles.length >= 6) {
      updateJoints(angles);
    }
  }, []);

  const syncJointAngles = useCallback(() => {
    // Get all the current joint angles from inputs
    const { j0, j1, j2, j3, j4, j5, j6 } = formApi.getFormState().values;

    // Create array of angles
    let angles = [j0, j1, j2, j3, j4, j5];

    // For 7 axis robots
    if (j6) {
      angles.push(j6);
    }

    // Round them
    angles = angles.map((a) => round(a, 100));

    // Update the value
    formApi.setValue('jointsString', angles.join(' '));
  });

  const syncRobotAngles = useCallback(() => {
    // Get selected robotId and type
    const { robotId, robotType } = formApi.getFormState().values;

    // Get the state of that robot
    if (robotId) {
      // Get current robot state
      const robotState = getRobotState(robotId);

      // Build list of motors
      const motors = Object.values(robotState.motors);

      // Get angles from robot states motors
      const angles = motors.map((motor) => {
        // Example TYPE_MAPPING["Rizon4"].position ==> "angle"
        const fieldName = TYPE_MAPPING[robotType].position;
        const motorPos = motor[fieldName];
        return round(motorPos, 1000);
      });

      // Update the joint angles in the control nav
      // NOTE: this is not native event so will trigger no actual movement on real robot
      const updatedValues = {};

      // Dynamically add joint angles to updatedValues object
      for (let i = 0; i < angles.length; i++) {
        updatedValues[`j${i}`] = angles[i];
      }

      // Add the jointsString to the updatedValues object
      updatedValues.jointsString = angles.join(' ');

      // Update the joint angles in the control nav
      // NOTE: this is not native event so will trigger no actual movement on real robot
      formApi.setTheseValues(updatedValues);
    }
  }, []);

  // const disabled = !connected;
  const disabled = false;

  return (
    <>
      <Flex direction="row" alignItems="center" gap="size-100">
        <h1>Robot Control</h1>
        {/* <ActionButton title="Reset Robot" aria-label="Reset Robot" onClick={() => resetRobot()}>
          <Refresh />
        </ActionButton> */}
        <ActionButton
          title="Switch Theme"
          aria-label="Switch Theme"
          onClick={() => toggleColorScheme()}
        >
          <Contrast />
        </ActionButton>
        <ActionButton title="Freeze" onPress={() => freezeRobot()} isDisabled={disabled}>
          <Stopwatch />
        </ActionButton>
        <TooltipTrigger>
          <ActionButton
            aria-label="Enable Robot"
            onPress={() => enable()}
            isDisabled={disabled}
            isQuiet={selectedRobotMeta?.stopped}
          >
            <LockOpen />
          </ActionButton>
          <Tooltip>Enable Robot - This will enable all motors on the robot.</Tooltip>
        </TooltipTrigger>
        <TooltipTrigger>
          <ActionButton
            aria-label="Disable Robot"
            onPress={() => stop()}
            isDisabled={disabled}
            isQuiet={!selectedRobotMeta?.stopped}
          >
            <LockClosed />
          </ActionButton>
          <Tooltip>Disable Robot - This will disable all motors on the robot.</Tooltip>
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
          <ActionButton
            aria-label="Zero Robot"
            onPress={() => zeroRobot()}
            isDisabled={!features?.motorZero}
          >
            <strong>0</strong>
          </ActionButton>
          <Tooltip>Zero Robot - This will zero out all motors in the robot.</Tooltip>
        </TooltipTrigger>
        <TooltipTrigger>
          <ActionButton
            aria-label="Reference Robot"
            onPress={() => referenceRobot()}
            isDisabled={!features?.motorReference}
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
        <TooltipTrigger>
          <ActionButton
            aria-label="Zero FT Robot"
            onPress={() => ftZeroRobot()}
            isDisabled={!features?.forceTourqueZero}
          >
            <strong>FT</strong>
          </ActionButton>
          <Tooltip>Zero FT Sensors - This will zero the force tourque sensors.</Tooltip>
        </TooltipTrigger>
        {/* <ActionButton title="Calibrate" onPress={() => calibrate()} isDisabled={disabled}>
          <Compass />
        </ActionButton> */}
        {/* <ActionButton title="Split Home" onPress={() => splitHome()} isDisabled={disabled}>
          <MoveUpDown />
        </ActionButton> */}
        <br />
        <Switch
          name="runOnRobot"
          label="Run On Robot"
          initialValue={false}
          isDisabled={!connected}
        />
      </Flex>
      <Flex direction="row" gap="size-500">
        <div className="sidenav-controls">
          <ul className="spectrum-SideNav">
            <Flex
              direction="row"
              alignItems="center"
              gap="size-100"
              UNSAFE_style={{ marginLeft: '-10px' }}
            >
              <Status status={!selectedRobotMeta?.stopped} posText="Enabled" negText="Disabled" />
              <Status status={selectedRobotMeta?.home} text="Home" />
              <Status status={selectedRobotMeta?.homing} text="Homing" />
              <Status status={selectedRobotMeta?.moving} text="Moving" />
              <Status status={selectedRobotMeta?.busy} text="Busy" />
            </Flex>
            <Flex direction="row" gap="size-100">
              <RobotType filter={(robot) => robot.frames && robot.frames.length > 6} />
              <Select
                label="Robot"
                name="robotId"
                defaultValue="na"
                aria-label="Robot"
                options={[{ value: 'na', label: 'Disconnect' }, ...robotOptions]}
              />
            </Flex>
            <Flex direction="row" alignItems="center" UNSAFE_style={{ marginBottom: '-20px' }}>
              <Switch
                name="robotAccel"
                label="Acceleration"
                initialValue={true}
                onNativeChange={onAccelChange}
                isDisabled={!connected}
              />
              <ContextualHelp variant="info">
                <Heading>Follow Robot</Heading>
                <Content>
                  <Text>
                    The robot in the 3D view will follow the actual robot.
                    <br />
                    <br />
                    <strong>Note:</strong> The control inputs on the left panel will NOT follow the
                    robot, they are purely used for controlling the robot. All real time joint
                    updates can be viewed on the right panel.
                  </Text>
                </Content>
              </ContextualHelp>
              <Switch
                name="followrobot"
                label="Follow"
                initialValue={false}
                isDisabled={!connected}
              />
              <ContextualHelp variant="info">
                <Heading>Keyboard Control</Heading>
                <Content>
                  <Text>Enables ability to control robot using arrow keys.</Text>
                </Content>
              </ContextualHelp>
              <Switch name="keyboardControl" label="Keyboard" initialValue={true} />
            </Flex>
            {/* ------------------------- ERRORS ------------------------- */}
            {selectedRobotMeta?.errors?.length > 0 && (
              <>
                <hr />
                <h3>Errors</h3>
                <Flex direction="row" alignItems="center" gap="size-100">
                  <>
                    <TableView aria-label="Motor Statuses" flex width="380px">
                      <TableHeader>
                        <Column maxWidth={100}>Type</Column>
                        <Column>Error</Column>
                      </TableHeader>
                      <TableBody>
                        {selectedRobotMeta?.errors.map((error) => (
                          <Row>
                            <Cell>
                              <span>{error.type}</span>
                            </Cell>
                            <Cell>
                              <span>{error.message}</span>
                            </Cell>
                          </Row>
                        ))}
                      </TableBody>
                    </TableView>
                  </>
                </Flex>
              </>
            )}
            <br />
            {/* ------------------------- POSITION CONTROLS ------------------------- */}
            <hr />
            <strong>Cartesian Controls</strong>
            <ContextualHelp variant="info">
              <Heading>Cartesian Controls</Heading>
              <Content>
                <Text>
                  These will control the cartesian position of the robot in the simulator.
                  <br />
                  <br />
                  <strong>Note:</strong> These controls will only affect the simulator unless "Run
                  On Robot" is toggled on.
                  <br />
                  <br />
                  <strong>Also Note:</strong> These controls always use the Inverse Kinematics of
                  our simulator to drive the robot. Changing a value here will affect the joint
                  controls below based on our IK.
                  <br />
                  <br />
                  If "Run On robot" is toggled on, this will result in moving the robot via a
                  "robotSetAngles" command to the connected robot.
                </Text>
              </Content>
            </ContextualHelp>
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
            <Flex direction="row" alignItems="center" gap="size-100">
              <strong>Joint Controls</strong>
              <ContextualHelp variant="info">
                <Heading>Joint Controls</Heading>
                <Content>
                  <Text>
                    These will control the individual joint positions of the robot in the simulator.
                    <br />
                    <br />
                    <strong>Note:</strong> These controls will only affect the simulator unless "Run
                    On Robot" is toggled on.
                  </Text>
                </Content>
              </ContextualHelp>
              <TooltipTrigger>
                <ActionButton
                  aria-label="Sync Joint Positions"
                  onPress={() => syncRobotAngles()}
                  isDisabled={!selectedRobotMeta}
                >
                  <Sync />
                </ActionButton>
                <Tooltip>
                  Sync Joint Positions - This will set these inputs to the robots current joint
                  positions on the connected robot.
                  <br />
                  <br />
                  Note: This will NOT trigger a command to the robot, its simply a one time snyc to
                  set these values to the robot actual values.
                </Tooltip>
              </TooltipTrigger>
            </Flex>
            {frames.map((frame, i) => {
              // Dont render control for stationary frame
              if (frame.frameType === 'stationary') {
                return null;
              }
              return (
                <Flex direction="row" alignItems="end" gap="size-100" key={`frame-control-${i}`}>
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
                  <TooltipTrigger>
                    <ActionButton
                      aria-label={`Home Motor j${i}`}
                      onPress={() => homeJoint(`j${i}`)}
                      isDisabled={disabled}
                    >
                      <Home />
                    </ActionButton>
                    <Tooltip>
                      Home Motor {`j${i}`} - This will send this motor to its home position.
                    </Tooltip>
                  </TooltipTrigger>
                  <TooltipTrigger>
                    <ActionButton
                      aria-label={`Enable Motor j${i}`}
                      onPress={() => motorEnable(`j${i}`)}
                      isDisabled={disabled}
                    >
                      <LockOpen />
                    </ActionButton>
                    <Tooltip>Enable Motor {`j${i}`} - This will enable this motor.</Tooltip>
                  </TooltipTrigger>
                  <TooltipTrigger>
                    {/* <div className="icon-red"> */}
                    <ActionButton
                      title="Stop"
                      onPress={() => motorDisable(`j${i}`)}
                      isDisabled={disabled}
                    >
                      <StopCircle />
                    </ActionButton>
                    {/* </div> */}
                    <Tooltip>
                      Disable Motor {`j${i}`} - This will stop and disable the motor.
                    </Tooltip>
                  </TooltipTrigger>
                  <TooltipTrigger>
                    <ActionButton onPress={() => motorResetErrors(`j${i}`)}>
                      <RemoveCircle />
                    </ActionButton>
                    <Tooltip>
                      Reset Motor {`j${i}`} Errors - This will reset any errors on this motor.
                    </Tooltip>
                  </TooltipTrigger>
                  {/* <ActionButton onPress={() => motorReference(`j${i}`)}>
                    <AlignCenter />
                  </ActionButton> */}
                </Flex>
              );
            })}
            <Flex direction="row" alignItems="end" gap="size-100">
              <Input name="jointsString" label="All Joints" autocomplete="off" width="340px" />
              <TooltipTrigger>
                <ActionButton aria-label="Sync Joint Angles" onPress={() => syncJointAngles()}>
                  <Sync />
                </ActionButton>
                <Tooltip>
                  Sync Joint Angles - This will set this input to the current values of all the
                  joint inputs above.
                  <br />
                  <br />
                  Note: This will NOT trigger a command to the robot, its simply a one time snyc
                  this field. To move the robot you can click "Go"
                </Tooltip>
              </TooltipTrigger>
              <TooltipTrigger>
                <div className="icon-orange">
                  <ActionButton
                    title="Go"
                    aria-label="Go"
                    type="button"
                    onPress={setAllJoints}
                    minWidth="50px"
                  >
                    Go
                  </ActionButton>
                </div>
                <Tooltip>
                  Go - This will set all the space seperated joint angles in the input.
                  <br />
                  <br />
                  <strong>Note:</strong> This will trigger a robotSetAngles to the connected robot
                  if "Run On Robot" is enabled.
                </Tooltip>
              </TooltipTrigger>
            </Flex>

            {selectedRobotMeta?.config?.favorites?.joints && (
              <>
                <br />
                <strong>Saved Joint Positions</strong>
                <ContextualHelp variant="info">
                  <Heading>Saved Joint Positions</Heading>
                  <Content>
                    <Text>
                      Saved joint positions for the connected robot.
                      <br />
                      <br />
                      <strong>Note:</strong> Clicking these buttons will move the robot to the saved
                      positions
                    </Text>
                  </Content>
                </ContextualHelp>
                <br />
                <Flex
                  direction="row"
                  alignItems="end"
                  gap="size-100"
                  width="440px"
                  wrap
                  UNSAFE_style={{ marginTop: '10px' }}
                >
                  {Object.entries(selectedRobotMeta.config.favorites.joints).map(([key, value]) => {
                    return (
                      <div className="icon-orange">
                        <ActionButton
                          onPress={() => {
                            updateJoints(value);
                          }}
                          width="216px"
                        >
                          {key}
                        </ActionButton>
                      </div>
                    );
                  })}
                </Flex>
              </>
            )}

            {/* ------------------------- GRIPPER CONTROLS ------------------------- */}
            <hr />
            <Flex direction="row" alignItems="end" gap="size-100">
              <InputSlider
                name="gripper"
                onNativeChange={onGripperChange}
                label={`Gripper %`}
                type="number"
                minValue={0}
                maxValue={100}
                initialValue={20}
                step={1}
              />
            </Flex>
            <InputSlider
              name="gripperVelocity"
              // onNativeChange={onGripperVelocityChange}
              label={`Velocity m/s`}
              type="number"
              minValue={0}
              maxValue={0.1}
              initialValue={0.05}
              step={0.01}
            />
            <InputSlider
              name="gripperForce"
              // onNativeChange={onGripperVelocityChange}
              label={`Force N`}
              type="number"
              minValue={0}
              maxValue={50}
              initialValue={0}
            />
            <Flex direction="row" alignItems="end" gap="size-100">
              <NumberInput
                name="gripperClosed"
                label="Close Position"
                initialValue={0}
                minValue={0}
                maxValue={100}
              />
              <NumberInput
                name="gripperOpened"
                label="Open Position"
                initialValue={100}
                minValue={0}
                maxValue={100}
              />
              <Flex direction="column" gap="size-50">
                <small>Open</small>
                <ActionButton onPress={() => gripperOpen()} width="size-900">
                  <RailRightOpen />
                  <RailRightClose />
                </ActionButton>
              </Flex>
              <Flex direction="column" gap="size-50">
                <small>Close</small>
                <ActionButton onPress={() => gripperClose()} width="size-900">
                  <RailRightClose />
                  <RailRightOpen />
                </ActionButton>
              </Flex>
            </Flex>

            {selectedRobotMeta?.config?.favorites?.gripper && (
              <>
                <br />
                <strong>Saved Gripper Positions</strong>
                <ContextualHelp variant="info">
                  <Heading>Saved Gripper Positions</Heading>
                  <Content>
                    <Text>Clicking these buttos will send gripper to saved locaitons</Text>
                  </Content>
                </ContextualHelp>
                <br />
                <Flex
                  direction="row"
                  alignItems="end"
                  gap="size-100"
                  width="440px"
                  wrap
                  UNSAFE_style={{ marginTop: '10px' }}
                >
                  {Object.entries(selectedRobotMeta.config.favorites.gripper).map(
                    ([key, value]) => {
                      return (
                        <div className="icon-orange">
                          <ActionButton
                            onPress={() => {
                              gripperSet(value);
                            }}
                            width="216px"
                          >
                            {key}
                          </ActionButton>
                        </div>
                      );
                    },
                  )}
                </Flex>
              </>
            )}

            {/* ------------------------- FREEDRIVE CONTROLS ------------------------- */}
            <hr />
            <strong>Freedrive</strong>
            <ContextualHelp variant="info">
              <Heading>Joint Controls</Heading>
              <Content>
                <Text>
                  These will allow you to freedrive the robot. To do so you must unlock the joints
                  or axis that you want to float.
                </Text>
              </Content>
            </ContextualHelp>
            <Flex direction="row" alignItems="end" gap="size-100">
              <Select
                label="Frame"
                name="freedriveFrame"
                initialValue="work"
                options={[
                  { value: 'work', label: 'Work Frame' },
                  { value: 'flange', label: 'Flange Frame' },
                  { value: 'tcp', label: 'TCP Frame' },
                ]}
              />
              <TooltipTrigger>
                <ActionButton
                  onPress={() => enableFreedrive()}
                  isQuiet={!selectedRobotMeta?.freedrive}
                >
                  <LockOpen />
                </ActionButton>
                <Tooltip>
                  Enable Freedrive - This will enable freedrive on the selected cartesian floating
                  axis.
                </Tooltip>
              </TooltipTrigger>
              <TooltipTrigger>
                <ActionButton
                  onPress={() => disableFreedrive()}
                  isQuiet={selectedRobotMeta?.freedrive}
                >
                  <LockClosed />
                </ActionButton>
                <Tooltip>Disable Freedrive - This will disable freedrive completely.</Tooltip>
              </TooltipTrigger>
              <Switch name="nullspace" label="Nullspace" initialValue={false} />
            </Flex>
            {/* <strong className="nav-label">Cartesian</strong> */}
            <span className="nav-label">Cartesian</span>
            <Flex direction="row" alignItems="end" gap="size-100" width="235px" wrap>
              <ActionButton
                width="size-900"
                onPress={() => toggleAxis('x')}
                isQuiet={!cartFloatingAxis?.x}
              >
                {cartFloatingAxis?.x ? <LockOpen /> : <LockClosed />}
                <Text>X</Text>
              </ActionButton>
              <ActionButton
                width="size-900"
                onPress={() => toggleAxis('y')}
                isQuiet={!cartFloatingAxis?.y}
              >
                {cartFloatingAxis?.y ? <LockOpen /> : <LockClosed />}
                <Text>Y</Text>
              </ActionButton>
              <ActionButton
                width="size-900"
                onPress={() => toggleAxis('z')}
                isQuiet={!cartFloatingAxis?.z}
              >
                {cartFloatingAxis?.z ? <LockOpen /> : <LockClosed />}
                <Text>Z</Text>
              </ActionButton>
              <ActionButton
                width="size-900"
                onPress={() => toggleAxis('rx')}
                isQuiet={!cartFloatingAxis?.rx}
              >
                {cartFloatingAxis?.rx ? <LockOpen /> : <LockClosed />}
                <Text>RX</Text>
              </ActionButton>
              <ActionButton
                width="size-900"
                onPress={() => toggleAxis('ry')}
                isQuiet={!cartFloatingAxis?.ry}
              >
                {cartFloatingAxis?.ry ? <LockOpen /> : <LockClosed />}
                <Text>RY</Text>
              </ActionButton>
              <ActionButton
                width="size-900"
                onPress={() => toggleAxis('rz')}
                isQuiet={!cartFloatingAxis?.rz}
              >
                {cartFloatingAxis?.rz ? <LockOpen /> : <LockClosed />}
                <Text>RZ</Text>
              </ActionButton>
            </Flex>
            <span className="nav-label">Joints</span>
            <Flex direction="row" alignItems="end" gap="size-100" width="235px" wrap>
              {frames.map((frame, i) => {
                // Dont render control for stationary frame
                if (frame.frameType === 'stationary') {
                  return null;
                }
                return (
                  <ActionButton
                    width="size-900"
                    onPress={() => toggleAxis(`j${i}`)}
                    isQuiet={!cartFloatingAxis[`j${i}`]}
                  >
                    {cartFloatingAxis[`j${i}`] ? <LockOpen /> : <LockClosed />}
                    <Text>{`j${i}`}</Text>
                  </ActionButton>
                );
              })}
            </Flex>

            {/* ------------------------- Adjustment CONTROLS ------------------------- */}
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
