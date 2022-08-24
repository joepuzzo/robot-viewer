import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RobotControllerContext, RobotStateContext } from '../context/RobotContext';
import { useInformed } from 'informed';
import { useStateWithGetter } from '../hooks/useStateWithGetter';
import { toRadians } from '../../lib/toRadians';
import { toDeg } from '../../lib/toDeg';
import { inverse } from '../../lib/inverse';

const getZXZ = (orientation) => {
  switch (orientation) {
    case 'x':
      return [-90, -90, 0];
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

const RobotProvider = ({ children }) => {
  // So we can access all of our form values!
  const informed = useInformed();

  // Determines how many values are in motion
  const [movements, updateMovements] = useState(0);
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
  }, []);

  const updateRobot = (i) => {
    const formApi = informed.getController('robot')?.getFormApi();

    console.log('FORM STATE', formApi.getFormState());

    const { base, v0, v1, v2, v3, v4, v5, waypoints, x0 } = formApi.getFormState().values;

    // We only want to go if we have more waypoints
    if (waypoints && waypoints.length - 1 !== i) {
      // Get the waypoint
      // const { x, y, z, r1, r2, r3 } = waypoints[i];
      const { x, y, z, orientation } = waypoints[i];

      const [r1, r2, r3] = getZXZ(orientation);

      console.log('Going to waypoint', i, 'pos', waypoints[i]);

      // We give in degrees so turn into rads
      const ro1 = toRadians(r1);
      const ro2 = toRadians(r2);
      const ro3 = toRadians(r3);

      const angles = inverse(x, y, z, ro1, ro2, ro3, {
        a1: base + v0,
        a2: v1,
        a3: v2,
        a4: v3,
        a5: v4,
        a6: v5,
        x0,
      });

      console.log('Waypoint Setting angles to', angles);

      if (!angles.find((a) => isNaN(a))) {
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
      }

      // Increase the step
      const current = getSimulating();
      setSimulating({ ...current, step: current.step + 1 });
    } else {
      // Stop simulation
      const current = getSimulating();
      setSimulating({ ...current, step: 0, play: false });
    }
  };

  useEffect(() => {
    const current = getSimulating();
    // We are done moving
    if (movements === 0) {
      console.log('Not moving', current);
      // See if we are simulating
      if (current.play) {
        // Get next step in simulation
        console.log('Playing step', current.step);
        updateRobot(current.step);
      }
    }
  }, [movements, simulating.play]);

  // The state of the robot
  const robotState = {
    movements,
    motors,
    simulating,
  };

  // Robot controller
  const robotController = useMemo(() => {
    return {
      updateMotion,
      play,
    };
  }, []);

  return (
    <RobotControllerContext.Provider value={robotController}>
      <RobotStateContext.Provider value={robotState}>{children}</RobotStateContext.Provider>
    </RobotControllerContext.Provider>
  );
};

export default RobotProvider;
