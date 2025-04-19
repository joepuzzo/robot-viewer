import React from 'react';
import { StatusLight } from '@adobe/react-spectrum';

export const Status = ({ status }) => {
  if (status) {
    return (
      <StatusLight variant="positive" maxWidth={100}>
        Yes
      </StatusLight>
    );
  } else {
    return (
      <StatusLight variant="negative" maxWidth={100}>
        No
      </StatusLight>
    );
  }
};
