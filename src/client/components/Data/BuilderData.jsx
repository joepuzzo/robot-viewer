import {
  ActionButton,
  Cell,
  Column,
  Flex,
  Heading,
  Row,
  TableBody,
  TableHeader,
  TableView,
  Text,
  Tooltip,
  TooltipTrigger,
} from '@adobe/react-spectrum';
import { useFormState } from 'informed';
import React, { useMemo } from 'react';
import {
  buildHomogeneousDenavitForTable,
  buildHomogeneousDenavitStringForTable,
} from '../../../lib/denavitHartenberg';
import { cleanAndRoundMatrix } from '../../../lib/roundMatrix';
import { round } from '../../../lib/round';
import { isParallel } from '../../utils/frame';
import { toRadians } from '../../../lib/toRadians';
import Copy from '@spectrum-icons/workflow/Copy';

const TransformationMatricies = ({ pTable }) => {
  if (pTable.length === 0) return null;

  const { values } = useFormState();

  // Add joint angle to p table
  const table1 = JSON.parse(JSON.stringify(pTable));
  table1.forEach((row, i) => {
    const value = values[`j${i}`];
    row[0] = `${row[0]} + ${value}`;
  });

  const table2 = JSON.parse(JSON.stringify(pTable));
  table2.forEach((row, i) => {
    row[0] = toRadians(row[0] + values[`j${i}`]);
    row[1] = toRadians(row[1]);
  });

  // 3_6 table
  const table3 = JSON.parse(JSON.stringify(pTable)).slice(3, 6);
  table3.forEach((row, i) => {
    const value = values[`j${i}`];
    const ang = `t${i + 4}`;

    if (row[0] == 0) {
      row[0] = ang;
    } else {
      row[0] = `${row[0]} + ${ang}`;
    }
  });

  // console.table(table3);

  const result1 = buildHomogeneousDenavitStringForTable(table1, 'default');
  const result2 = buildHomogeneousDenavitForTable(table2);
  const result3 = buildHomogeneousDenavitStringForTable(table3, 'default');

  const roundedEndMatrix = cleanAndRoundMatrix(result2.endMatrix, (v) => round(v, 10));

  const labels = ['X0', 'Y0', 'Z0', ''];

  return (
    <>
      {result1.homogeneousMatriceis.map((matrix, i) => {
        const value = values[`j${i}`];
        return (
          <div key={`result-${i}`}>
            <Flex alignItems="center" gap="20px">
              <h4>
                {`H${i}_${i + 1}`}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{`θ = ${value}`}
              </h4>
              <TooltipTrigger>
                <ActionButton
                  title="copy"
                  onPress={() => {
                    // Tab seperated ( can paste into spreadsheed editor)
                    const tsv = matrix.map((row) => row.join('\t')).join('\n');
                    navigator.clipboard.writeText(tsv);
                  }}
                >
                  <Copy />
                </ActionButton>
                <Tooltip>
                  Copy Table - Will copy table so you can paste into spreadsheet editor
                </Tooltip>
              </TooltipTrigger>
            </Flex>
            <TableView aria-label="Denavit Hartenberg Table" flex>
              <TableHeader>
                <Column>X</Column>
                <Column>Y</Column>
                <Column>Z</Column>
                <Column>D</Column>
              </TableHeader>
              <TableBody>
                {matrix.map((row, j) => (
                  <Row key={`info-${i}-${j}`}>
                    <Cell>{row[0]}</Cell>
                    <Cell>{row[1]}</Cell>
                    <Cell>{row[2]}</Cell>
                    <Cell>{row[3]}</Cell>
                  </Row>
                ))}
              </TableBody>
            </TableView>
            <br />
            {/* <TableView flex>
              <TableHeader>
                <Column>X</Column>
                <Column>Y</Column>
                <Column>Z</Column>
                <Column>D</Column>
              </TableHeader>
              <TableBody>
                {result2.matriceis[i].map((row) => (
                  <Row>
                    <Cell>{row[0]}</Cell>
                    <Cell>{row[1]}</Cell>
                    <Cell>{row[2]}</Cell>
                    <Cell>{row[3]}</Cell>
                  </Row>
                ))}
              </TableBody>
            </TableView>
            <br /> */}
          </div>
        );
      })}
      <Heading>H3_6 Matix</Heading>
      <Flex alignItems="center" gap="20px">
        <h4>H3_6</h4>
        <TooltipTrigger>
          <ActionButton
            title="copy"
            onPress={() => {
              // Tab seperated ( can paste into spreadsheed editor)
              const tsv = result3.endHomogeneous.map((row) => row.join('\t')).join('\n');
              navigator.clipboard.writeText(tsv);
            }}
          >
            <Copy />
          </ActionButton>
          <Tooltip>Copy Table - Will copy table so you can paste into spreadsheet editor</Tooltip>
        </TooltipTrigger>
      </Flex>
      <TableView flex aria-label="Denavit Hartenberg Table">
        <TableHeader>
          <Column showDivider width={10}>
            {' '}
          </Column>
          <Column>X1</Column>
          <Column>Y1</Column>
          <Column>Z1</Column>
          <Column>D</Column>
        </TableHeader>
        <TableBody>
          {result3.endHomogeneous.map((row, i) => (
            <Row key={`3_6-${i}`}>
              <Cell>{labels[i]}</Cell>
              <Cell>{row[0]}</Cell>
              <Cell>{row[1]}</Cell>
              <Cell>{row[2]}</Cell>
              <Cell>{row[3]}</Cell>
            </Row>
          ))}
        </TableBody>
      </TableView>
      <Heading>Final Transformation Matix</Heading>
      <h4>H0_6</h4>
      <TableView flex aria-label="Denavit Hartenberg Table">
        <TableHeader>
          <Column showDivider width={10}>
            {' '}
          </Column>
          <Column>X1</Column>
          <Column>Y1</Column>
          <Column>Z1</Column>
          <Column>D</Column>
        </TableHeader>
        <TableBody>
          {roundedEndMatrix.map((row, i) => (
            <Row key={`final-${i}`}>
              <Cell>{labels[i]}</Cell>
              <Cell>{row[0]}</Cell>
              <Cell>{row[1]}</Cell>
              <Cell>{row[2]}</Cell>
              <Cell>
                <strong style={i < 3 ? { color: 'orange' } : {}}>{row[3]}</strong>
              </Cell>
            </Row>
          ))}
        </TableBody>
      </TableView>
    </>
  );
};

const buildParameterTable = ({ frames, base, endEffector }) => {
  const rows = [];
  // console.log('-----------------------------------------');
  frames.forEach((frame, i) => {
    // Dont do anything for first frame
    if (i != 0) {
      const n = frame;
      const nMinus1 = frames[i - 1];

      // new frame vs previous frame
      const yzParallel = isParallel(n.x, n.y, n.z, n.r1, n.r2, n.r3, 'y', 'z');
      const xxParallel = isParallel(n.x, n.y, n.z, n.r1, n.r2, n.r3, 'x', 'x');
      const xyParallel = isParallel(n.x, n.y, n.z, n.r1, n.r2, n.r3, 'x', 'y');
      const xyParallelSame = isParallel(n.x, n.y, n.z, n.r1, n.r2, n.r3, 'x', 'y', true);

      /* --------------- CALCULATE THETA --------------- */

      // theta = rotation around `Zn-1` that is required to get axis `Xn-1` to match `Xn` ( rotate frame n-1)
      let theta = n.r3;
      if (yzParallel) theta = -n.r2;

      // Special case for first frame
      if (i == 1 && yzParallel) {
        theta += nMinus1.r3;
      }

      /* --------------- CALCULATE ALPHA --------------- */

      // alpha = rotation around `Xn` that is required to get axis `Zn-1` to match axis `Zn` ( rotate frame n-1 )
      let alpha = n.r1;
      // X is parallel to X
      if (xxParallel) {
        alpha = n.r1;
      }
      // X is parallel to Y and in same direction
      else if (xyParallelSame) {
        alpha = n.r2;
      }
      // X is parallel to Y and in different directions
      else if (xyParallel) {
        alpha = -n.r2;
      }

      /* ----------------- CALCULATE r ----------------- */

      // r  = look at distance between center of two frames along the `Xn` direction
      let r = 0;

      // If our x is parallel to the previous x then distance is based off of x
      if (xxParallel) {
        r = n.moveBack === 'x' ? n.x + n.moveBackBy : n.x;
      }

      // If our x is parallel to the previous y then distance is based off of y

      // Case1: frame n points away from frame n-1
      if (xyParallelSame) {
        // TODO Maybe we need to determine if we moved in a positive or negative direction along y i.e n.y > 0
        r = n.moveBack === 'y' ? n.y + n.moveBackBy : n.y;
      }
      // Case2: frame n points towards from frame n-1
      else if (xyParallel) {
        // TODO maybe do same as when it points away
        r = n.moveBack === 'y' ? -n.y + n.moveBackBy : -n.y;
      }

      // NOTE: X should never be parallel to z as that breaks one of the frame rules so we dont worry about that case

      /* ----------------- CALCULATE d ----------------- */

      // d = look at the distance between center of two fames along `Zn-1` direction. ( this is n.z + any previous offsets )
      let d = n.moveBack === 'z' ? n.z + n.moveBackBy : n.z;

      // If there is a base distance add that too d of the second itteration
      if (base && i === 1) {
        d = d + base;
      }

      // If there is an end effector distance add that to the d of the last itteration
      if (endEffector && i === frames.length - 1) d += endEffector;

      // If the previous frame was moved so take that into account
      // Why?? because that frames location with respect to this kinematics diagram is actually in a different spot
      // ( affected by the moveBack )
      if (nMinus1.moveBack === 'x' || nMinus1.moveBack === 'y') {
        // In order to do this we must first determine if we want to add or remove this value +/-

        // Case1: Our previous frames z is in the same direction as the previous frames move back by
        // To elaborate, current frame moves along previous frames z, and previous frame moved back along its previous frames moveBack
        const backParallel = isParallel(
          nMinus1.x,
          nMinus1.y,
          nMinus1.z,
          nMinus1.r1,
          nMinus1.r2,
          nMinus1.r3,
          'z',
          nMinus1.moveBack,
          true, // Only if its in the same direction :) THIS IS KEY!!!!
        );
        if (backParallel) {
          d = d + -nMinus1.moveBackBy;
        }
        // Case2: Our current frames z is NOT in the same direction as the previous frames move back by
        else {
          d = d + nMinus1.moveBackBy;
        }
      }

      // console.log(`HERE AFTER n.z: ${n.z}, n.moveBackBy: ${n.moveBackBy}, d: ${d}, r: ${r}`);

      // console.log('theta', theta, 'alpha', alpha, 'r', r, 'd', d);
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

  console.log('WTF', frames);

  const pTable = buildParameterTable({ frames, base, endEffector });

  return (
    <>
      <Flex alignItems="center" gap="20px">
        <h3>Denavit Hartenberg Table</h3>
        <TooltipTrigger>
          <ActionButton
            title="copy"
            onPress={() => {
              // Tab seperated ( can paste into spreadsheed editor)
              const tsv = pTable.map((row) => row.join('\t')).join('\n');
              navigator.clipboard.writeText(tsv);
            }}
          >
            <Copy />
          </ActionButton>
          <Tooltip>Copy Table - Will copy table so you can paste into spreadsheet editor</Tooltip>
        </TooltipTrigger>
      </Flex>

      <TableView aria-label="Denavit Hartenberg Table" flex>
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
        <TableView aria-label="Denavit Hartenberg Transform Matrix" flex>
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
    </>
  );
};
