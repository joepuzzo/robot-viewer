import React from 'react';

import { TableView, TableHeader, TableBody, Column, Row, Cell } from '@adobe/react-spectrum';
import { Status } from '../../Shared/Status';

export const ExampleJointData = ({ motor }) => {
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
            <Cell>Ready</Cell>
            <Cell>
              <Status status={motor.ready} />
            </Cell>
          </Row>
          <Row>
            <Cell>Homing</Cell>
            <Cell>
              <Status status={motor.homing} />
            </Cell>
          </Row>
          <Row>
            <Cell>Home</Cell>
            <Cell>
              <Status status={motor.home} />
            </Cell>
          </Row>
          <Row>
            <Cell>Homed</Cell>
            <Cell>
              <Status status={motor.homed} />
            </Cell>
          </Row>
          <Row>
            <Cell>Enabled</Cell>
            <Cell>
              <Status status={motor.enabled} />
            </Cell>
          </Row>
          <Row>
            <Cell>Moving</Cell>
            <Cell>
              <Status status={motor.moving} />
            </Cell>
          </Row>
          <Row>
            <Cell>Current Position</Cell>
            <Cell>
              <span>{motor.currentPos}</span>
            </Cell>
          </Row>
          <Row>
            <Cell>Goal Position</Cell>
            <Cell>
              <span>{motor.goalPos}</span>
            </Cell>
          </Row>
          <Row>
            <Cell>Error</Cell>
            <Cell>
              <span>{motor.error}</span>
            </Cell>
          </Row>
        </TableBody>
      </TableView>
    </div>
  );
};
