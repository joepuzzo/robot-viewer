import React from 'react';
import useApp from '../../hooks/useApp';
import { Waypoints } from '../Nav/Waypoints';

export const RobotExtra = () => {
  const { extraOpen } = useApp();
  return (
    <div className={extraOpen ? 'extra extra-visible' : 'extra'}>
      <Waypoints />
    </div>
  );
};
