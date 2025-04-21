import React from 'react';
import useApp from '../../hooks/useApp';
import { Cookbook } from '../Pages/Cookbook/Cookbook';
import { ResizablePopup } from '../Shared/ResizablePopup';

export const RobotExtra = () => {
  const { extraOpen } = useApp();
  return (
    <div className={extraOpen ? 'extra extra-visible' : 'extra'}>
      <ResizablePopup>
        <Cookbook />
      </ResizablePopup>
    </div>
  );
};
