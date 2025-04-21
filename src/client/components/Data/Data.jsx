import React, { useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import useApp from '../../hooks/useApp';

// Hooks
import useMedia from '../../hooks/useMedia';
import useOutsideAlerter from '../../hooks/useOutsideAlerter';

import { BuilderData } from './BuilderData';
import { MotorData } from './MotorData';
import { RobotData } from './RobotData';
import useRobotMeta from '../../hooks/useRobotMeta';

const DataBar = ({ children, wide }) => {
  const { dataOpen } = useApp();

  const className = `databar ${dataOpen ? 'databar-visible' : ''} ${wide ? 'databar-wide' : ''}`;

  return <div className={className}>{children}</div>;
};

export const Data = () => {

  const { connected } = useRobotMeta();

  return (
    <Routes>
      <Route
        path="/"
        element={connected ? (
          <DataBar>
            <RobotData />
          </DataBar>
        ) : null
        }
      />
      <Route
        path="/motor"
        element={connected ? (
          <DataBar>
            <MotorData />
            </DataBar>
        ) : null
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
