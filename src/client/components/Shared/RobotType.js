import React, { useMemo } from 'react';

import useApp from '../../hooks/useApp';
import Select from '../Informed/Select';

export const RobotType = () => {
  const { robotTypes, selectRobot } = useApp();

  const robotTypeOptions = useMemo(() => {
    if (robotTypes) {
      return Object.keys(robotTypes).map((t) => {
        return { value: t, label: t };
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
