import {
  Cell,
  Column,
  Heading,
  Row,
  TableBody,
  TableHeader,
  TableView,
  Text,
} from '@adobe/react-spectrum';
import { useFormState } from 'informed';
import React, { useMemo } from 'react';
import { buildHomogeneousDenavitStringForTable } from '../../../lib/denavitHartenberg';
import { isParallel } from '../../utils/frame';

const TransformationMatricies = ({ pTable }) => {
  if (pTable.length === 0) return null;

  const { homogeneousMatriceis, rotationalMatricies, endHomogeneous, endRotation } =
    buildHomogeneousDenavitStringForTable(pTable, 'default');

  return (
    <>
      {homogeneousMatriceis.map((matrix, i) => {
        return (
          <>
            <h4>{`H${i}_${i + 1}`}</h4>
            <TableView flex>
              <TableHeader>
                <Column>X</Column>
                <Column>Y</Column>
                <Column>Z</Column>
                <Column>D</Column>
              </TableHeader>
              <TableBody>
                {matrix.map((row) => (
                  <Row>
                    <Cell>{row[0]}</Cell>
                    <Cell>{row[1]}</Cell>
                    <Cell>{row[2]}</Cell>
                    <Cell>{row[3]}</Cell>
                  </Row>
                ))}
              </TableBody>
            </TableView>
            <br />
          </>
        );
      })}
      <Heading>Final Transformation Matix</Heading>
      <h4>H0_6</h4>
      <TableView flex>
        <TableHeader>
          <Column>X</Column>
          <Column>Y</Column>
          <Column>Z</Column>
          <Column>D</Column>
        </TableHeader>
        <TableBody>
          {endHomogeneous.map((row) => (
            <Row>
              <Cell>{row[0]}</Cell>
              <Cell>{row[1]}</Cell>
              <Cell>{row[2]}</Cell>
              <Cell>{row[3]}</Cell>
            </Row>
          ))}
        </TableBody>
      </TableView>
    </>
  );
};

const buildParameterTable = ({ frames, base, endEffector }) => {
  const rows = [];
  frames.forEach((frame, i) => {
    // Dont do anything for first frame
    if (i != 0) {
      const n = frame;
      const nMinus1 = frames[i - 1];

      const xyParallel = isParallel(n.x, n.y, n.z, n.r1, n.r2, n.r3, 'x', 'y');

      // theta = rotation around `Zn-1` that is required to get axis `Xn-1` to match `Xn` ( rotate frame n-1)
      const theta = n.r3;
      // alpha = rotation around `Xn` that is required to get axis `Zn-1` to match axis `Zn` ( rotate frame n-1 )
      let alpha = n.r1;
      if (xyParallel) alpha = -n.r2;

      // r  = look at distance between center of two frames along the `Xn` direction
      let r = 0;

      // If our x is parallel to the previous x
      if (isParallel(n.x, n.y, n.z, n.r1, n.r2, n.r3, 'x', 'x')) {
        r = n.moveBack === 'x' ? n.x + n.moveBackBy : n.x;
      }
      // If our x is parallel to the previous y
      if (isParallel(n.x, n.y, n.z, n.r1, n.r2, n.r3, 'x', 'y')) {
        r = n.moveBack === 'y' ? n.y + n.moveBackBy : n.y;
      }

      // d = look at the distance between center of two fames along `Zn-1` direction.
      let d = n.moveBack === 'z' ? n.z + n.moveBackBy : n.z;

      // If there is a base distance add that too d of the second itteration
      if (base && i === 1) d += base;

      // If there is an end effector distance add that to the d of the last itteration
      if (endEffector && i === frames.length - 1) d += endEffector;

      // If the previous frame was moved add that on
      if (nMinus1.moveBack === 'x') {
        d = d + -nMinus1.moveBackBy;
      }

      if (nMinus1.moveBack === 'z') {
        r = r + -nMinus1.moveBackBy;
      }
      rows.push([theta, alpha, r, d]);
    }
  });
  return rows;
};

export const BuilderData = () => {
  const { values } = useFormState();

  const { frames, base, endEffector } = values;

  // ---------- Time for Denavit Hartenberg!!!!! ----------
  // https://youtu.be/4WRhVqQaZTE
  //
  // 						             Zn
  // 					                ^
  // 					                |  Yn
  // 					  	            |   /
  // 					                |  /
  // 					                | /
  // 	    |_______[r]_______| + -----------> Xn
  //
  //      Zn-1				 |
  //      ^			  		 |
  //      |  Yn-1			[d]
  //   	  |   /				 |
  //      |  /			 	 |
  //      | /  				 |
  //      + -----------> Xn-1
  //
  // Step1: write out your kinimatic diagram accoding to the rules
  //
  // Step2: perform the following for each Hn_m
  //
  // theta = rotation around `Zn-1` that is required to get axis `Xn-1` to match `Xn` ( rotate frame n-1)
  // alpha = rotation around `Xn` that is required to get axis `Zn-1` to match axis `Zn` ( rotate frame n-1 )
  // r  = look at distance between center of two frames along the `Xn` direction
  // d = look at the distance between center of two fames along `Zn-1` direction.

  if (!frames) return null;

  const pTable = buildParameterTable({ frames, base, endEffector });

  return (
    <div>
      <h3>Denavit Hartenberg Table</h3>
      <TableView aria-label="Motor Statuses" flex>
        <TableHeader>
          <Column>θ</Column>
          <Column>α</Column>
          <Column>r</Column>
          <Column>d</Column>
        </TableHeader>
        <TableBody>
          {pTable.map((row, i) => {
            // Get variables for this row
            const theta = row[0];
            const alpha = row[1];
            const r = row[2];
            const d = row[3];

            return (
              <Row key={`frame-${i}`}>
                <Cell>{theta}</Cell>
                <Cell>{alpha}</Cell>
                <Cell>{r}</Cell>
                <Cell>{d}</Cell>
              </Row>
            );
          })}
        </TableBody>
      </TableView>
      {/* <img src="static/DenavitHartenberg.png" alt="Denavit Hartenberg" width="100%" /> */}
      <div>
        <Heading>Denavit Hartenberg Parameters</Heading>
        <Text>
          <strong>θ</strong> = rotation around <code>Zn-1</code> that is required to get axis{' '}
          <code>Xn-1</code> to match <code>Xn</code> ( rotate frame n-1 )
        </Text>
        <br />
        <br />
        <Text>
          <strong>α</strong> = rotation around <code>Xn</code> that is required to get axis{' '}
          <code>Zn-1</code> to match axis <code>Zn</code> ( rotate frame n-1 )
        </Text>
        <br />
        <br />
        <Text>
          <strong>r</strong> = look at distance between center of two frames along the{' '}
          <code>Xn</code> direction
        </Text>
        <br />
        <br />
        <Text>
          <strong>d</strong> = look at the distance between center of two fames along{' '}
          <code>Zn-1</code> direction.
        </Text>
      </div>
      <br />
      <div>
        <Heading>Denavit Hartenberg Transformation Matrix</Heading>
        <TableView aria-label="Motor Statuses" flex>
          <TableHeader>
            {/* <Column showDivider width={10}>
              {' '}
            </Column> */}
            <Column>X</Column>
            <Column>Y</Column>
            <Column>Z</Column>
            <Column>D</Column>
          </TableHeader>
          <TableBody>
            <Row>
              {/* <Cell>Xn-1</Cell> */}
              <Cell>cos(θ)</Cell>
              <Cell>-sin(θ) * cos(α)</Cell>
              <Cell>sin(θ) * sin(α)</Cell>
              <Cell>r * cos(θ)</Cell>
            </Row>
            <Row>
              {/* <Cell>Yn-1</Cell> */}
              <Cell>sin(θ)</Cell>
              <Cell>cos(θ) * cos(α)</Cell>
              <Cell>-cos(θ) * sin(α)</Cell>
              <Cell>r * sin(θ)</Cell>
            </Row>
            <Row>
              {/* <Cell>Zn-1</Cell> */}
              <Cell>0</Cell>
              <Cell>sin(α)</Cell>
              <Cell>cos(α)</Cell>
              <Cell>d</Cell>
            </Row>
            <Row>
              {/* <Cell> </Cell> */}
              <Cell>0</Cell>
              <Cell>0</Cell>
              <Cell>0</Cell>
              <Cell>1</Cell>
            </Row>
          </TableBody>
        </TableView>
      </div>
      <div>
        <Heading>Homogeneous Transformation matriceis</Heading>
        <TransformationMatricies pTable={pTable} />
      </div>
    </div>
  );
};
