import React from 'react';
import useApp from '../../hooks/useApp';
import { Cookbook } from '../Pages/Cookbook/Cookbook';

export const RobotExtra = () => {
  const { extraOpen } = useApp();
  return (
    <div className={extraOpen ? 'extra extra-visible' : 'extra'}>
      <Cookbook />
    </div>
  );
};
