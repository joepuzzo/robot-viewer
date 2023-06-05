import { Flex } from '@adobe/react-spectrum';
import React from 'react';
import { JointsData } from './JointsData/JointsData';
import { CameraData } from './CameraData';

export const RobotData = () => {
  return (
    <Flex direction="column">
      <JointsData />
      <CameraData />
    </Flex>
  );
};
