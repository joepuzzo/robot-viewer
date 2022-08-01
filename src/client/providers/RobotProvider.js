import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RobotControllerContext, RobotStateContext } from '../context/RobotContext';

const RobotProvider = ({ children }) => {
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

  useEffect(() => {
    if (movements === 0) {
    }
  }, [movements]);

  // The state of the robot
  const robotState = {
    movements,
    motors,
  };

  // Robot controller
  const robotController = useMemo(() => {
    return {
      updateMotion,
    };
  }, []);

  return (
    <RobotControllerContext.Provider value={robotController}>
      <RobotStateContext.Provider value={robotState}>{children}</RobotStateContext.Provider>
    </RobotControllerContext.Provider>
  );
};

export default RobotProvider;
