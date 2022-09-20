import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SimulateControllerContext, SimulateStateContext } from '../context/SimulateContext';
import { useFormApi, useInformed } from 'informed';
import { useStateWithGetter } from '../hooks/useStateWithGetter';
import useRobotController from '../hooks/useRobotController';
import useApp from '../hooks/useApp';

const getZXZ = (orientation) => {
  switch (orientation) {
    case 'x':
      return [90, 90, 90];
    case '-x':
      return [-270, -90, 0];
    case 'y':
      return [0, -90, 0];
    case '-y':
      return [-180, -90, 0];
    case 'z':
      return [0, 0, 0];
    case '-z':
      return [-90, -180, 0];
    default:
      break;
  }
};

const SimulateProvider = ({ children }) => {
  // So we can access all of our form values!
  const informed = useInformed();

  const { socket } = useApp();

  // Get robot control
  const { updateRobot, updateGripper } = useRobotController();

  // Form Api
  const formApi = useFormApi();

  // Determines how many values are in motion
  const [movements, updateMovements, getMovements] = useStateWithGetter(0);
  const [motors, updateMotors] = useState({
    j0: { state: 'stop' },
    j1: { state: 'stop' },
    j2: { state: 'stop' },
    j3: { state: 'stop' },
    j4: { state: 'stop' },
    j5: { state: 'stop' },
  });

  // For simulation of the robot
  const [simulating, setSimulating, getSimulating] = useStateWithGetter({
    play: false,
    step: 0,
  });

  const stepRef = useRef();

  const updateMotion = useCallback((motor, event) => {
    console.log('UPDATE - Motor:', motor, 'Event:', event);

    // Update amount of motors in motion
    if (event === 'move') {
      updateMovements((cur) => {
        return cur + 1;
      });
    } else {
      updateMovements((cur) => {
        return cur - 1;
      });
    }

    // Now update the motor state
    updateMotors((cur) => {
      const updated = { ...cur };
      updated[motor].state = event;
      return updated;
    });
  }, []);

  const play = useCallback(() => {
    setSimulating({
      ...getSimulating(),
      step: 0,
      play: true,
    });

    // Play first step
    robotUpdate(0);
  }, []);

  const stop = useCallback(() => {
    setSimulating({
      ...getSimulating(),
      step: 0,
      play: false,
    });
  }, []);

  const robotUpdate = (i) => {
    const formApi = informed.getController('robot')?.getFormApi();

    const { waypoints } = formApi.getFormState().values;

    // We only want to go if we have more waypoints
    if (waypoints && waypoints.length - 1 !== i) {
      // Get the waypoint
      // const { x, y, z, r1, r2, r3 } = waypoints[i];
      const { x, y, z, orientation, speed, grip } = waypoints[i];

      const { wait } = waypoints[i - 1] ? waypoints[i - 1] : 0;

      console.log('WAIT', wait);

      setTimeout(() => {
        if (orientation != 'g') {
          console.log('Going to waypoint', i, 'pos', waypoints[i]);
          // Get rotations
          const [r1, r2, r3] = getZXZ(orientation);
          // Update the robot
          updateRobot(x, y, z, r1, r2, r3, speed);
        } else {
          // Update the gripper
          updateGripper(grip ? 20 : 60);
        }

        // Increase the step
        const current = getSimulating();
        setSimulating({ ...current, step: current.step + 1 });
      }, [wait * 1000]);
    } else {
      // Stop simulation
      const current = getSimulating();
      setSimulating({ ...current, step: 0, play: false });
    }
  };

  useEffect(() => {
    const current = getSimulating();
    const { runOnRobot } = formApi.getFormState().values;
    const mvmnts = getMovements();
    console.log('MOVEMENTS', mvmnts);
    // We are done moving
    if (mvmnts === 0) {
      console.log('Not moving', current);
      // See if we are simulating
      if (current.play && !runOnRobot) {
        // Get next step in simulation
        console.log('Playing step', current.step);
        robotUpdate(current.step);
      }
    }
  }, [movements]);

  // Register for robots events
  useEffect(() => {
    const movedHandler = () => {
      console.log('Robot moved');
      const { runOnRobot } = formApi.getFormState().values;

      // Get status of our simulation ( movement )
      const current = getSimulating();
      // See if we are executing and running on robot
      if (current.play && runOnRobot) {
        // Get next step in simulation
        console.log('Robot moved - Playing step', current.step);
        setTimeout(() => {
          robotUpdate(current.step);
        }, [500]);
      }
    };

    socket.on('robotMoved', movedHandler);

    return () => {
      socket.removeListener('robotMoved', movedHandler);
    };
  }, []);

  // The state of the robot
  const simulateState = {
    movements,
    motors,
    simulating,
  };

  // Robot controller
  const simulateController = useMemo(() => {
    return {
      updateMotion,
      play,
      stop,
    };
  }, []);

  return (
    <SimulateControllerContext.Provider value={simulateController}>
      <SimulateStateContext.Provider value={simulateState}>
        {children}
      </SimulateStateContext.Provider>
    </SimulateControllerContext.Provider>
  );
};

export default SimulateProvider;
