import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SimulateControllerContext, SimulateStateContext } from '../context/SimulateContext';
import { useFormApi, useInformed } from 'informed';
import { useStateWithGetter } from '../hooks/useStateWithGetter';
import useRobotController from '../hooks/useRobotController';
import useApp from '../hooks/useApp';
import { getXYZ, getZXZ } from '../utils/getEulers';

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

    const { waypoints, runOnRobot } = formApi.getFormState().values;

    // We only want to go if we have more waypoints
    if (waypoints && waypoints.length !== i) {
      // Get the waypoint
      // const { x, y, z, r1, r2, r3 } = waypoints[i];
      const { x, y, z, r1, r2, r3, orientation, speed, grip, gripper } = waypoints[i];

      const { wait } = waypoints[i - 1] ? waypoints[i - 1] : 0;

      console.log('WAIT', wait);

      setTimeout(() => {
        // If we are not a gripper command
        if (!gripper) {
          console.log('Going to waypoint', i, 'pos', waypoints[i]);
          // Get rotations
          let rotations = [r1, r2, r3];
          // Rotations might be "x", "y", "z"
          if (orientation != 'c') {
            rotations = getZXZ(orientation);
          }
          const [rot1, rot2, rot3] = rotations;
          // Update the robot
          updateRobot(x, y, z, rot1, rot2, rot3, speed);
        } else {
          // Update the gripper
          updateGripper(grip ? 20 : 60);
        }

        // We are going to move to next step now
        const current = getSimulating();
        let nextStep = current.step + 1;

        setSimulating({ ...current, step: nextStep });

        // If we are a grip action and are not running on robot just go to next step
        console.log('HMM', gripper);
        if (gripper && !runOnRobot) {
          robotUpdate(nextStep);
        }
      }, wait * 1000);
    } else {
      // Stop simulation
      const current = getSimulating();
      setSimulating({ ...current, step: 0, play: false });

      const { repeat } = formApi.getFormState().values;

      // If we are on repeat keep going
      if (repeat) {
        setTimeout(() => {
          play();
        }, 100);
      }
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
