import React from 'react';

import {
  TableView,
  TableHeader,
  TableBody,
  Column,
  Row,
  Cell,
  ProgressBar,
} from '@adobe/react-spectrum';
import { Status } from '../../Shared/Status';
import { ARJointData } from './ARJointData';

// const exampleIgus = {
//   id: 'j0',
//   canId: 16,
//   homing: false,
//   home: false,
//   // TODO add to backend vvv
//   ready: true,
//   enabled: false,
//   moving: false,
//   // TODO add to backend ^^^
//   currentPosition: 90.000235647645,
//   currentTics: 8000,
//   encoderPulsePosition: 90.000235647645,
//   encoderPulseTics: 8000,
//   jointPositionSetPoint: 90,
//   jointPositionSetTics: 8000,
//   goalPosition: 90,
//   motorCurrent: 120,
//   error: null,
//   errorCode: null,
//   errorCodeString: 'n/a',
//   voltage: 0,
//   tempMotor: 20,
//   tempBoard: 30,
//   direction: 'forwards',
//   motorError: null,
//   adcError: null,
//   rebelError: null,
//   controlError: null,
//   sendInterval: 20,
//   calculatedVelocity: 29,
//   currentVelocity: 30,
// };

export const IgusRebelJointData = ({ motor }) => {
  const verbose = true;

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
            <Cell>Enabled</Cell>
            <Cell>
              <Status status={motor.enabled} />
            </Cell>
          </Row>
          <Row>
            <Cell>Zeroed</Cell>
            <Cell>
              <Status status={motor.zeroed} />
            </Cell>
          </Row>
          <Row>
            <Cell>Moving</Cell>
            <Cell>
              <Status status={motor.moving} />
            </Cell>
          </Row>
          <Row>
            <Cell>Goal Position</Cell>
            <Cell>
              <span>{motor.goalPosition}</span>
            </Cell>
          </Row>
          <Row>
            <Cell>Set Position</Cell>
            <Cell>
              <span>{motor.jointPositionSetPoint}</span>
            </Cell>
          </Row>
          {verbose ? (
            <Row>
              <Cell>Set Encoder Tics</Cell>
              <Cell>
                <span>{motor.jointPositionSetTics}</span>
              </Cell>
            </Row>
          ) : null}
          <Row>
            <Cell>Current Position</Cell>
            <Cell>
              <span>{motor.currentPosition}</span>
            </Cell>
          </Row>
          <Row>
            <Cell>Current Encoder Tics</Cell>
            <Cell>
              <span>{motor.currentTics}</span>
            </Cell>
          </Row>
          {verbose ? (
            <Row>
              <Cell>Encoder Pulse Position</Cell>
              <Cell>
                <span>{motor.encoderPulsePosition}</span>
              </Cell>
            </Row>
          ) : null}
          {verbose ? (
            <Row>
              <Cell>Encoder Pulse Encoder Tics</Cell>
              <Cell>
                <span>{motor.encoderPulseTics}</span>
              </Cell>
            </Row>
          ) : null}
          <Row>
            <Cell>Current</Cell>
            <Cell>
              <ProgressBar
                label="Amps"
                minValue={0}
                maxValue={200}
                formatOptions={{}}
                value={motor.motorCurrent}
                maxWidth="size-2000"
              />
            </Cell>
          </Row>
          <Row>
            <Cell>Set Velocity</Cell>
            <Cell>
              <ProgressBar
                label="°/s"
                minValue={0}
                maxValue={50}
                formatOptions={{}}
                value={motor.currentVelocity}
                maxWidth="size-2000"
              />
            </Cell>
          </Row>
          <Row>
            <Cell>Actual Velocity</Cell>
            <Cell>
              <ProgressBar
                label="°/s"
                minValue={0}
                maxValue={50}
                formatOptions={{}}
                value={motor.calculatedVelocity}
                maxWidth="size-2000"
              />
            </Cell>
          </Row>
          <Row>
            <Cell>Send Interval</Cell>
            <Cell>
              <ProgressBar
                label="ms"
                minValue={0}
                maxValue={50}
                formatOptions={{}}
                value={motor.sendInterval}
                maxWidth="size-2000"
              />
            </Cell>
          </Row>
          {verbose ? (
            <Row>
              <Cell>Voltage</Cell>
              <Cell>
                <ProgressBar
                  label="Volts"
                  minValue={0}
                  maxValue={100}
                  formatOptions={{}}
                  value={motor.voltage}
                  maxWidth="size-2000"
                />
              </Cell>
            </Row>
          ) : null}
          {verbose ? (
            <Row>
              <Cell>Motor Temp</Cell>
              <Cell>
                <ProgressBar
                  label="°C"
                  minValue={0}
                  maxValue={100}
                  formatOptions={{}}
                  value={motor.motorTemp}
                  maxWidth="size-2000"
                />
              </Cell>
            </Row>
          ) : null}
          {verbose ? (
            <Row>
              <Cell>Board Temp</Cell>
              <Cell>
                <ProgressBar
                  label="°C"
                  minValue={0}
                  maxValue={100}
                  formatOptions={{}}
                  value={motor.boardTemp}
                  maxWidth="size-2000"
                />
              </Cell>
            </Row>
          ) : null}
          <Row>
            <Cell>Direction</Cell>
            <Cell>
              <span>{motor.direction}</span>
            </Cell>
          </Row>
          <Row>
            <Cell>Error</Cell>
            <Cell>
              <span>{motor.error}</span>
            </Cell>
          </Row>
          <Row>
            <Cell>Error Code</Cell>
            <Cell>
              <span>{motor.errorCodeString}</span>
            </Cell>
          </Row>
          <Row>
            <Cell>Error Code String</Cell>
            <Cell>
              <span>{motor.errorCode}</span>
            </Cell>
          </Row>
          <Row>
            <Cell>MTR/ADC/RBL/CTRL</Cell>
            <Cell>
              <span>
                {`${motor.motorError ?? ''} / ${motor.adcError ?? ''} / ${
                  motor.rebelError ?? ''
                } / ${motor.controlError ?? ''}`}
              </span>
            </Cell>
          </Row>
        </TableBody>
      </TableView>
    </div>
  );
};
