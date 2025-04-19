import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { RobotExtra } from './RobotExtra';

export const Extra = () => {
  return (
    <Routes>
      <Route path="/" element={<RobotExtra />} />
      <Route path="*" element={null} />
    </Routes>
  );
};
