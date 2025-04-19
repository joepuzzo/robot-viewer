import React, { useMemo } from 'react';

import useApp from '../../hooks/useApp';
import Select from '../Informed/Select';

export const RobotType = ({ filter = () => true }) => {
  const { robotTypes, selectRobot } = useApp();

  const robotTypeOptions = useMemo(() => {
    if (robotTypes) {
      return Object.entries(robotTypes)
        .filter(([key, robot]) => filter(robot))
        .map(([key, robot]) => {
          return { value: key, label: key };
        });
    }
    return [];
  }, [robotTypes]);

  return (
    <Select
      label="Robot Type"
      name="robotType"
      defaultValue="Example"
      onNativeChange={selectRobot}
      options={[...robotTypeOptions]}
    />
  );
};
