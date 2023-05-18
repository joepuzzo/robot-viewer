import React, { useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import useApp from '../../hooks/useApp';

// Hooks
import useMedia from '../../hooks/useMedia';
import useOutsideAlerter from '../../hooks/useOutsideAlerter';

import { BuilderData } from './BuilderData';
import { MotorData } from './MotorData';
import { RobotData } from './RobotData';

const DataBar = ({ children, wide }) => {
  const { dataOpen } = useApp();

  const className = `databar ${dataOpen ? 'databar-visible' : ''} ${wide ? 'databar-wide' : ''}`;

  return <div className={className}>{children}</div>;
};

export const Data = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <DataBar>
            <RobotData />
          </DataBar>
        }
      />
      <Route
        path="/motor"
        element={
          <DataBar>
            <MotorData />
          </DataBar>
        }
      />
      <Route
        path="/builder"
        element={
          <DataBar wide>
            <BuilderData />
          </DataBar>
        }
      />
      <Route path="*" element={null} />
    </Routes>
    // </div>
  );
};
