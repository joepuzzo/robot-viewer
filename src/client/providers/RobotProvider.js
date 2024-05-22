import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  RobotControllerContext,
  RobotStateContext,
  RobotMetaContext,
  RobotKinimaticsContext,
} from '../context/RobotContext';
import io from 'socket.io-client';
import useApp from '../hooks/useApp';
import { useFieldState, useFormApi } from 'informed';
import { toRadians } from '../../lib/toRadians';
import { inverse as inverseBasic } from 'kinematics-js';
import { inverse as inverseUR } from '../../lib/inverse_UR';
// import { inverse } from '../../lib/inverse';
import { toDeg } from '../../lib/toDeg';
import { forward } from 'kinematics-js';
import { debounce } from '../utils/debounce';
// import { forwardKinematics } from '../../lib/newForward';

/**
 * Provide any application specific data
 */
const RobotProvider = ({ children }) => {
  // Get socket
  const { socket, config } = useApp();

  // Get access to the form api to control form
  const formApi = useFormApi();

  // For registered robots
  const [robots, setRobots] = useState({});
  const [robotStates, setRobotStates] = useState({});

  // For connection
  const [connected, setConnected] = useState(false);

  // Ref to use in functions for if robot is connected
  const connectedRef = useRef();
  connectedRef.current = connected;

  // For forward kinimatics
  const [endPosition, setEndPosition] = useState({ x: 0, y: 0, z: 0 });

  // Get value of robotId
  const { value: robotId } = useFieldState('robotId');

  // For controlling ball locaiton
  const setBallRef = useRef();

  // Register for robots events
  useEffect(() => {
    const robotsHandler = (rbts) => {
      setRobots(rbts);
    };

    const stateHandler = (id, robotState) => {
      setRobotStates((prev) => {
        const newStates = { ...prev };
        newStates[id] = robotState;
        return newStates;
      });
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
    socket.on('robots', robotsHandler);
    socket.on('robotConnected', connectedHandler);
    socket.on('robotDisconnected', disconnectedHandler);

    return () => {
      socket.removeListener('robot', stateHandler);
      socket.removeListener('robots', robotsHandler);
      socket.removeListener('robotConnected', connectedHandler);
      socket.removeListener('robotDisconnected', disconnectedHandler);
    };
  }, []);

  // Whenever the selected Id changes check for connection
  useEffect(() => {
    // Check to see if robot is connected
    if (Object.keys(robots).find((id) => id == robotId)) {
      setConnected(true);
    } else {
      setConnected(false);
    }
  }, [robotId, robots]);

  // Build selectable options list
  const robotOptions = useMemo(() => {
    const robotsArray = Object.values(robots);
    return robotsArray.map((robot) => {
      return {
        value: robot.id,
        label: `Robot-${robot.id}`,
      };
    });
  }, [robots]);

  // define robot state
  const value = {
    robots,
    robotStates,
    robotOptions,
    connected,
  };

  // define robot meta
  const meta = useMemo(() => {
    console.log('ROBOTS', robots);
    return {
      robots,
      robotOptions,
      connected,
    };
  }, [robots, robotOptions, connected]);

  // Update robot function
  const updateJoint = useCallback((motorId, value) => {
    console.log(`Setting joint ${motorId} to`, value);

    // If we are connected to a robot send update to that robot
    if (connectedRef.current) {
      const robotId = formApi.getValue('robotId');
      socket.emit('motorSetPos', robotId, motorId, value);
    }
  }, []);

  // Update gripper function
  const updateGripper = useCallback((value, speed) => {
    console.log(`Setting gripper to ${value} at a speed of ${speed}`);
    formApi.setValue('gripper', value);

    // If we are connected to a robot send update to that robot
    if (connectedRef.current) {
      const robotId = formApi.getValue('robotId');
      socket.emit('gripperSetPos', robotId, value, speed);
    }
  }, []);

  // Update config function
  const updateConfig = useCallback((key, value) => {
    console.log(`Setting config ${key} to`, value);

    // If we are connected to a robot send update to that robot
    if (connectedRef.current) {
      const robotId = formApi.getValue('robotId');
      socket.emit('robotUpdateConfig', robotId, key, value);
    }
  }, []);

  // Save config function
  const saveConfig = useCallback(() => {
    console.log(`Saving robot config`);

    // If we are connected to a robot send update to that robot
    if (connectedRef.current) {
      const robotId = formApi.getValue('robotId');
      socket.emit('robotWriteConfig', robotId);
    }
  }, []);

  // Update forward
  const updateForward = () => {
    const { j0, j1, j2, j3, j4, j5, base, v0, v1, v2, v3, v4, v5, x0, endEffector } =
      formApi.getFormState().values;

    const robotConfig = {
      base: base,
      v1: v0,
      v2: v1,
      v3: v2,
      v4: v3,
      v5: v4,
      v6: v5 + endEffector,
      x0,
    };

    const res = forward(
      toRadians(j0),
      toRadians(j1),
      toRadians(j2),
      toRadians(j3),
      toRadians(j4),
      toRadians(j5),
      robotConfig,
    );

    // console.log('CONFIG', robotConfig);

    const x = res[0][3];
    const y = res[1][3];
    const z = res[2][3];

    // const { position, orientation } = forwardKinematics([j0, j1, j2, j3, j4, j5], {
    //   // IGUS
    //   // dhParameters: [
    //   //   { theta: 0, alpha: 90, r: 0, d: 25.2 },
    //   //   { theta: 90, alpha: 0, r: 23.7, d: 0 },
    //   //   { theta: -90, alpha: -90, r: 0, d: 0 },
    //   //   { theta: 0, alpha: 90, r: 0, d: 29.7 },
    //   //   { theta: 0, alpha: -90, r: 0, d: 0 },
    //   //   { theta: 0, alpha: 0, r: 0, d: 22.6 },
    //   // ],
    //   // AR4
    //   dhParameters: [
    //     { theta: 0, alpha: 90, r: 6.42, d: 13.867 + 3.11 },
    //     { theta: 90, alpha: 0, r: 30.5, d: 0 },
    //     { theta: -90, alpha: -90, r: 0, d: 0 },
    //     { theta: 0, alpha: 90, r: 0, d: 22.263 },
    //     { theta: 0, alpha: -90, r: 0, d: 0 },
    //     { theta: 0, alpha: 0, r: 0, d: 10 + 3.625 }, // TODO fix bug that does not add the 3.625 to the last d value
    //   ],
    // });

    // console.log('X', x, 'Y', y, 'Z', z);
    // console.log('NX', position[0], 'NY', position[1], 'NZ', position[2]);
    // console.log('R1', orientation[0], 'R2', orientation[1], 'R2', orientation[2]);

    setEndPosition({ x, y, z });
  };

  const debouncedUpdateForward = useMemo(() => {
    return debounce(updateForward);
  }, []);

  const configRef = useRef();
  configRef.current = config;

  // Update robot function
  const updateRobot = useCallback((x, y, z, r1, r2, r3, speed) => {
    // Get fixed values off of form state
    const { base, v0, v1, v2, v3, v4, v5, x0, y0, runOnRobot, endEffector } =
      formApi.getFormState().values;

    // We give in degrees so turn into rads
    const ro1 = toRadians(r1);
    const ro2 = toRadians(r2);
    const ro3 = toRadians(r3);

    // console.log('Getting angles for', [x, y, z]);
    const inverse = configRef.current.inverseType === 'UR' ? inverseUR : inverseBasic;

    const angles = inverse(x, y, z, ro1, ro2, ro3, {
      base: base,
      v1: v0,
      v2: v1,
      v3: v2,
      v4: v3,
      v5: v4,
      v6: v5 + endEffector,
      x0,
      y0,
      flip: configRef.current.flip,
      adjustments: configRef.current.adjustments,
    });

    // console.log('Setting angles to', angles);

    if (!angles.find((a) => isNaN(a))) {
      // Step1: Update the form
      formApi.setTheseValues({
        j0: toDeg(angles[0]),
        j1: toDeg(angles[1]), //- 2, // TEMP OFFSET FOR TESTING WHAT HAPPENS
        j2: toDeg(angles[2]), //- 2, // TEMP OFFSET FOR TESTING WHAT HAPPENS
        j3: toDeg(angles[3]),
        j4: toDeg(angles[4]),
        j5: toDeg(angles[5]),
        x,
        y,
        z,
        r1,
        r2,
        r3,
      });

      // Step2: If we are connected to a robot send angles to that robot
      if (connectedRef.current && runOnRobot) {
        const robotId = formApi.getValue('robotId');
        socket.emit(
          'robotSetAngles',
          robotId,
          angles.map((angle) => toDeg(angle)),
          // TODO add back but need to be careful different speed for AR vs Igus At the moment ( steps/s vs deg/s )
          // speed
        );
      }

      // Update forward kinematics
      debouncedUpdateForward();
    }
  }, []);

  // Update robot function
  const updateJoints = useCallback((angles, speed) => {
    // Get fixed values off of form state
    const { runOnRobot, endEffector } = formApi.getFormState().values;

    console.log('Setting angles to', angles);

    if (!angles.find((a) => isNaN(a))) {
      // Step1: Update the form
      formApi.setTheseValues({
        j0: angles[0],
        j1: angles[1],
        j2: angles[2],
        j3: angles[3],
        j4: angles[4],
        j5: angles[5],
        // Maybe update this via forward kinematics
        // x,
        // y,
        // z,
        // r1,
        // r2,
        // r3,
      });

      // Step2: If we are connected to a robot send angles to that robot
      if (connectedRef.current && runOnRobot) {
        const robotId = formApi.getValue('robotId');
        socket.emit(
          'robotSetAngles',
          robotId,
          angles,
          // TODO add back but need to be careful different speed for AR vs Igus At the moment ( steps/s vs deg/s )
          // speed
        );
      }

      // Update forward kinematics
      debouncedUpdateForward();
    }
  }, []);

  // Build robot controller
  const robotController = useMemo(() => {
    return {
      updateGripper,
      updateJoint,
      updateRobot,
      updateConfig,
      saveConfig,
      setBallRef,
      updateJoints,
    };
  }, []);

  const kinimatics = useMemo(
    () => ({
      endPosition,
      updateForward: debouncedUpdateForward,
    }),
    [endPosition, debouncedUpdateForward],
  );

  return (
    <RobotControllerContext.Provider value={robotController}>
      <RobotMetaContext.Provider value={meta}>
        <RobotKinimaticsContext.Provider value={kinimatics}>
          <RobotStateContext.Provider value={value}>{children}</RobotStateContext.Provider>
        </RobotKinimaticsContext.Provider>
      </RobotMetaContext.Provider>
    </RobotControllerContext.Provider>
  );
};

export default RobotProvider;
