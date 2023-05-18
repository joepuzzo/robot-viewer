import React, { useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Hooks
import useMedia from '../../hooks/useMedia';

import { BuilderData } from './BuilderData';
import { MotorData } from './MotorData';
import { RobotData } from './RobotData';

export const Data = () => {
  const { isDesktopBigUp } = useMedia();

  if (!isDesktopBigUp) {
    return null;
  }

  return (
    <Routes>
      <Route path="/" element={<RobotData />} />
      <Route path="/motor" element={<MotorData />} />
      <Route path="/builder" element={<BuilderData />} />
    </Routes>
  );
};
