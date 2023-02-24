import { Cell, Column, Row, TableBody, TableHeader, TableView } from '@adobe/react-spectrum';
import { useFormState } from 'informed';
import React from 'react';
import { isParallel } from '../../utils/frame';

export const BuilderData = () => {
  const { values } = useFormState();

  const { frames } = values;

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

  return (
    <div>
      <h3>Denavit Hartenberg Table</h3>
      <TableView aria-label="Motor Statuses" flex width="380px">
        <TableHeader>
          <Column>Theta</Column>
          <Column>Alpha</Column>
          <Column>R</Column>
          <Column>D</Column>
        </TableHeader>
        <TableBody>
          {frames.map((frame, i) => {
            // Dont do anything for first frame
            if (i === 0) return null;

            const n = frame;
            const nMinus1 = frames[i - 1];

            // theta = rotation around `Zn-1` that is required to get axis `Xn-1` to match `Xn` ( rotate frame n-1)
            const theta = n.r3;
            // alpha = rotation around `Xn` that is required to get axis `Zn-1` to match axis `Zn` ( rotate frame n-1 )
            const alpha = n.r1;

            // TODO we cant assume what to offset the r by, we need to determine what the previous frames parallel line is ( might be y )

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

            // If the previous frame was moved add that on
            if (nMinus1.moveBack === 'x') {
              d = d + -nMinus1.moveBackBy;
            }

            if (nMinus1.moveBack === 'z') {
              r = r + -nMinus1.moveBackBy;
            }

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
    </div>
  );
};
