import React, { useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Hooks
import useApp from '../../hooks/useApp';

import useOutsideAlerter from '../../hooks/useOutsideAlerter';
import { BuilderData } from './BuilderData';
import { MotorData } from './MotorData';
import { RobotData } from './RobotData';

export const Data = () => {
  return (
    <Routes>
      <Route path="/" element={<RobotData />} />
      <Route path="/motor" element={<MotorData />} />
      <Route path="/builder" element={<BuilderData />} />
    </Routes>
  );
};
