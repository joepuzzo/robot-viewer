import React from 'react';

import { TableView, TableHeader, TableBody, Column, Row, Cell } from '@adobe/react-spectrum';
import { Status } from '../../Shared/Status';

export const RizonJointData = ({ motor }) => {
  return (
    <div>
      <h3>{motor.id}</h3>
      <TableView aria-label="Motor Statuses" flex width="380px">
        <TableHeader>
          <Column>Name</Column>
          <Column>Status</Column>
        </TableHeader>
        <TableBody>
          <Row>
            <Cell>Current Position</Cell>
            <Cell>
              <span>{motor.angle}</span>
            </Cell>
          </Row>
        </TableBody>
      </TableView>
    </div>
  );
};
