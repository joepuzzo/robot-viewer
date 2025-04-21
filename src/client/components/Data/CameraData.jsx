import { TableView } from '@adobe/react-spectrum';
import { Cell, Column, Row, TableBody, TableHeader } from '@react-stately/table';
import React from 'react';
import useCamera from '../../hooks/useCamera';

export const CameraData = () => {
  const data = useCamera();

  if (!data) return null;

  return (
    <div>
      <TableView aria-label="Camera Data" flex>
        <TableHeader>
          <Column>Id</Column>
          <Column>Type</Column>
          <Column>Conf</Column>
          <Column>X</Column>
          <Column>Y</Column>
          <Column>Z</Column>
        </TableHeader>
        <TableBody>
          {data.map((obj) => {
            return (
              <Row>
                <Cell>{obj.id}</Cell>
                <Cell>{obj.type}</Cell>
                <Cell>{obj.confidence}</Cell>
                <Cell>{obj.x}</Cell>
                <Cell>{obj.y}</Cell>
                <Cell>{obj.z}</Cell>
              </Row>
            );
          })}
        </TableBody>
      </TableView>
    </div>
  );
};
