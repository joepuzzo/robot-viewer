import { Flex } from '@adobe/react-spectrum';
import React from 'react';
import { JointsData } from './JointsData/JointsData';
import { CameraData } from './CameraData';
import { GeneralData } from './GeneralData';

export const RobotData = () => {
  return (
    <Flex direction="column">
      <GeneralData />
      <JointsData />
      <CameraData />
    </Flex>
  );
};
