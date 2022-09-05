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
import { inverse } from '../../lib/inverse';
import { toDeg } from '../../lib/toDeg';
import { forward } from '../../lib/forward';

/**
 * Provide any application specific data
 */
const RobotProvider = ({ children }) => {
  // Get socket
  const { socket } = useApp();

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

  // Update forward
  const updateForward = () => {
    const { j0, j1, j2, j3, j4, j5, base, v0, v1, v2, v3, v4, v5, x0 } =
      formApi.getFormState().values;

    const robotConfig = {
      a1: base + v0,
      a2: v1,
      a3: v2,
      a4: v3,
      a5: v4,
      a6: v5,
      x0,
    };

    const res = forward(
      toRadians(j0),
      toRadians(j1),
      toRadians(j2),
      toRadians(j3),
      toRadians(j4),
      toRadians(j5),
      robotConfig
    );

    const x = res[0][3];
    const y = res[1][3];
    const z = res[2][3];

    setEndPosition({ x, y, z });
  };

  // Update robot function
  const updateRobot = useCallback((x, y, z, r1, r2, r3) => {
    // Get fixed values off of form state
    const { base, v0, v1, v2, v3, v4, v5, x0 } = formApi.getFormState().values;

    // We give in degrees so turn into rads
    const ro1 = toRadians(r1);
    const ro2 = toRadians(r2);
    const ro3 = toRadians(r3);

    console.log('Getting angles for', [x, y, z]);

    const angles = inverse(x, y, z, ro1, ro2, ro3, {
      a1: base + v0,
      a2: v1,
      a3: v2,
      a4: v3,
      a5: v4,
      a6: v5,
      x0,
    });

    console.log('Setting angles to', angles);

    if (!angles.find((a) => isNaN(a))) {
      // Step1: Update the form
      formApi.setTheseValues({
        j0: toDeg(angles[0]),
        j1: toDeg(angles[1]),
        j2: toDeg(angles[2]),
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
      if (connectedRef.current) {
        const robotId = formApi.getValue('robotId');
        socket.emit(
          'robotSetAngles',
          robotId,
          angles.map((angle) => toDeg(angle))
        );
      }

      // Update forward kinematics
      // updateForward();
    }
  }, []);

  // Build robot controller
  const robotController = useMemo(() => {
    return {
      updateJoint,
      updateRobot,
    };
  }, []);

  const kinimatics = {
    endPosition,
    updateForward,
  };

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
