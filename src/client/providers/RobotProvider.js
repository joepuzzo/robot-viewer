import React, { useEffect, useMemo, useState } from 'react';
import { RobotControllerContext, RobotStateContext } from '../context/RobotContext';
import io from 'socket.io-client';
import useApp from '../hooks/useApp';
import { useFieldState, useFormApi } from 'informed';

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

  // Build robot controller
  const robotController = useMemo(() => {
    return {};
  }, []);

  return (
    <RobotControllerContext.Provider value={robotController}>
      <RobotStateContext.Provider value={value}>{children}</RobotStateContext.Provider>
    </RobotControllerContext.Provider>
  );
};

export default RobotProvider;
