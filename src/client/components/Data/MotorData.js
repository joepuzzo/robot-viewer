import React from 'react';
import useApp from '../../hooks/useApp';
import { JointsData } from './JointsData/JointsData';

export const MotorData = () => {
  const { navOpen } = useApp();

  return (
    <nav className={`databar ${navOpen ? 'databar-visible' : ''}`}>
      <JointsData />
    </nav>
  );
};
