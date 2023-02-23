import React, { useEffect, useMemo } from 'react';
import { ActionButton, Flex } from '@adobe/react-spectrum';
import { intersect } from 'mathjs';

import Select from '../Informed/Select';
import InputSlider from '../Informed/InputSlider';
import RadioGroup from '../Informed/RadioGroup';
import Switch from '../Informed/Switch';
import {
  ArrayField,
  useFieldState,
  useArrayFieldState,
  useArrayFieldItemApi,
  Debug,
  Relevant,
  useScope,
  useScopedState,
} from 'informed';
import { getEulers } from '../../utils/getEulers';
import { matrixDot } from '../../../lib/matrixDot';

function areAllValuesDefined(obj = {}, keys) {
  return keys.every((key) => obj[key] != null);
}

function rotateAroundXAxis(matrix, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const rotation = [
    [1, 0, 0, 0],
    [0, cos, -sin, 0],
    [0, sin, cos, 0],
    [0, 0, 0, 1],
  ];
  return matrixDot(matrix, rotation);
}

function rotateAroundYAxis(matrix, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const rotation = [
    [cos, 0, sin, 0],
    [0, 1, 0, 0],
    [-sin, 0, cos, 0],
    [0, 0, 0, 1],
  ];
  return matrixDot(matrix, rotation);
}

function rotateAroundZAxis(matrix, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const rotation = [
    [cos, -sin, 0, 0],
    [sin, cos, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ];
  return matrixDot(matrix, rotation);
}

// decrementFrameIndex("frames[2]");  // Returns "frames[1]"
// decrementFrameIndex("frames[5]");  // Returns "frames[4]"
// decrementFrameIndex("frames[0]");  // Returns "frames[-1]"
function decrementFrameIndex(string) {
  return string.replace(/\[(\d+)\]/, (_, number) => `[${Number(number) - 1}]`);
}

/**
 *
 * @param {*} dx
 * @param {*} dy
 * @param {*} dz
 * @param {*} rx_deg
 * @param {*} ry_deg
 * @param {*} rz_deg
 * @param {*} a - the new frame
 * @param {*} b - the previous frame
 * @returns
 *
 *        X2  Y2  Z2
 *   X1 [ 1,  0,  0,  dx]
 *   Y1 [ 0,  1,  0,  dy]
 *   Z1 [ 0,  0,  1,  dz]
 *      [ 0,  0,  0,  1]
 *
 */
function isPerpendicular(dx, dy, dz, rx_deg, ry_deg, rz_deg, a, b) {
  // Convert rotations from degrees to radians
  const rx = (rx_deg * Math.PI) / 180;
  const ry = (ry_deg * Math.PI) / 180;
  const rz = (rz_deg * Math.PI) / 180;

  // Create 4x4 transformation matrix using the rotations and offsets
  let transform = [
    [1, 0, 0, dx],
    [0, 1, 0, dy],
    [0, 0, 1, dz],
    [0, 0, 0, 1],
  ];

  // Apply rotations to the matrix
  transform = rotateAroundXAxis(transform, rx);
  transform = rotateAroundYAxis(transform, ry);
  transform = rotateAroundZAxis(transform, rz);

  // Check if the a axis of the new frame is perpendicular to the b axis of the previous frame
  return Math.abs(transform[2][0]) === 0;
}

/**
 *
 * @param {*} dx
 * @param {*} dy
 * @param {*} dz
 * @param {*} rx_deg
 * @param {*} ry_deg
 * @param {*} rz_deg
 * @param {*} a - the new frame
 * @param {*} b - the previous frame
 * @returns
 *
 *        X2  Y2  Z2
 *   X1 [ 1,  0,  0,  dx]
 *   Y1 [ 0,  1,  0,  dy]
 *   Z1 [ 0,  0,  1,  dz]
 *      [ 0,  0,  0,  1]
 *
 */
function isParallel(dx, dy, dz, rx_deg, ry_deg, rz_deg, a, b) {
  // Convert rotations from degrees to radians
  const rx = (rx_deg * Math.PI) / 180;
  const ry = (ry_deg * Math.PI) / 180;
  const rz = (rz_deg * Math.PI) / 180;

  // Create 4x4 transformation matrix using the rotations and offsets
  let transform = [
    [1, 0, 0, dx],
    [0, 1, 0, dy],
    [0, 0, 1, dz],
    [0, 0, 0, 1],
  ];

  // Apply rotations to the matrix
  transform = rotateAroundXAxis(transform, rx);
  transform = rotateAroundYAxis(transform, ry);
  transform = rotateAroundZAxis(transform, rz);

  // Check if the a axis of the new frame is parallel to the b axis of the previous frame
  console.log(JSON.stringify({ dx, dy, dz, rx_deg, ry_deg, rz_deg, a, b }));
  return Math.abs(transform[a][b]) === 1;
}

function createVector(point1, point2) {
  const x = point2[0] - point1[0];
  const y = point2[1] - point1[1];
  const z = point2[2] - point1[2];

  return [x, y, z];
}

// For Learning Direction Vector https://www.youtube.com/watch?v=R5r1IH2hII8
// For Learing intersections https://www.youtube.com/watch?v=N-qUfr-rz_Y
function xIntersectsZ(dx, dy, dz, rx_deg, ry_deg, rz_deg) {
  // Convert rotations from degrees to radians
  const rx = (rx_deg * Math.PI) / 180;
  const ry = (ry_deg * Math.PI) / 180;
  const rz = (rz_deg * Math.PI) / 180;

  // Create 4x4 transformation matrix using the rotations and offsets
  let transform = [
    [1, 0, 0, dx],
    [0, 1, 0, dy],
    [0, 0, 1, dz],
    [0, 0, 0, 1],
  ];

  // Apply rotations to the matrix
  transform = rotateAroundXAxis(transform, rx);
  transform = rotateAroundYAxis(transform, ry);
  transform = rotateAroundZAxis(transform, rz);

  const xP1 = [dx, dy, dz];
  const xP2 = [transform[0][0] + dx, transform[1][0] + dy, transform[2][0] + dz];
  const xDirectionVector = createVector(xP1, xP2);

  const zP1 = [0, 0, 0];
  const zP2 = [0, 0, 1];
  const zDirectionVector = createVector(zP1, zP2);

  // Vector equation
  // r = startPoint + t * directionVector

  // TODO use ours instead of maths
  // return linesIntersect(xP1, xDirectionVector, zP1, zDirectionVector);

  // console.log('--------------------------');
  // console.log('FOR', xP1, xP2, zP1, zP2);
  // console.log('RES', intersect(xP1, xP2, zP1, zP2));
  return intersect(xP1, xP2, zP1, zP2);
}

function linesIntersect(line1Start, line1Direction, line2Start, line2Direction) {
  const [start1X, start1Y, start1Z] = line1Start;
  const [start2X, start2Y, start2Z] = line2Start;
  const [dir1X, dir1Y, dir1Z] = line1Direction;
  const [dir2X, dir2Y, dir2Z] = line2Direction;

  // ------------------------------------------
  // Step1: Convert lines into parametric form
  // let x = start1X + t * dir1X;
  // let y = start1Y + t * dir1Y;
  // let z = start1Z + t * dir1Z;
  //
  // let x = start2X + s * dir2X;
  // let y = start2Y + s * dir2Y;
  // let z = start2Z + s * dir2Z;

  // ------------------------------------------
  // Step2: Define equations

  // x = x
  // start1X + t * dir1X = start2X + s * dir2X

  // y = y
  // start1Y + t * dir1Y = start2Y + s * dir2Y

  // z = z
  // start1Z + t * dir1Z = start2Z + s * dir2Z

  // ------------------------------------------
  // Step3: Re arrange the equations to get constants on one side

  // Re arrange x = x to get constant on the right
  // ( t * dir1X ) - ( s * dir2X ) = start2X - start1X

  // Re arrange y = y to get constant on the right
  // ( t * dir1Y ) - ( s * dir2Y ) = start2Y - start1Y

  // Re arrange z = z to get constant on the right
  // ( t * dir1Z ) - ( s * dir2Z ) = start2Z - start1Z
}

const validate = (value, values, { formApi, scope }) => {
  // Get this value and the value before
  const n = formApi.getValue(`${scope}`);
  const nMinus1 = formApi.getValue(decrementFrameIndex(`${scope}`));

  // console.log('---------------------------------------');
  // console.log(`${scope}`, JSON.stringify(n));
  // console.log(`${scope} - 1`, JSON.stringify(nMinus1));

  // Special case no value yet
  if (!n) return;

  // Special case if we dont have values yet
  if (!areAllValuesDefined(n, ['r1', 'r2', 'r3', 'x', 'y', 'z'])) return;

  // Special case if we are base frame
  if (!nMinus1) return;

  // console.log('RES', isXZPerpendicular(n.x, n.y, n.z, n.r1, n.r2, n.r3));

  const { moveBack, moveBackBy } = n;
  let x = n.x;
  let y = n.y;
  let z = n.z;

  if (moveBack === 'x') x = x + moveBackBy;
  if (moveBack === '-x') x = x - moveBackBy;

  if (moveBack === 'y') y = y + moveBackBy;
  if (moveBack === '-y') y = y - moveBackBy;

  if (moveBack === 'z') z = z + moveBackBy;
  if (moveBack === '-z') z = z - moveBackBy;

  // console.log('WTF', 'MoeBack', moveBack, 'MoeBackBy', moveBackBy, 'XYZ', x, y, z);

  // The X axis must be perpendicular to the Z axis of the frame before it
  if (!isPerpendicular(x, y, z, n.r1, n.r2, n.r3, 2, 0))
    return 'X axis must be perpendicular to the previous z axis';

  // Each X axis must intersect the Z axis of the frame before it ( except frame 0 )
  if (!xIntersectsZ(x, y, z, n.r1, n.r2, n.r3)) return 'X axis must intersect the previous z axis';
};

let DEFAULT_VALUE = [
  {
    r1: 0,
    r2: 0,
    r3: 0,
    x: 0,
    y: 0,
    z: 0,
  },
];

let MY_DEFAULT_VALUE = [
  {
    r1: 0,
    r2: 0,
    r3: 0,
    x: 0,
    y: 0,
    z: 0,
  },
  {
    r1: 90,
    r2: 0,
    r3: 0,
    x: 0,
    y: 0,
    z: 15,
  },
  {
    r1: 0,
    r2: 0,
    r3: 90,
    x: 0,
    y: 20,
    z: 0,
  },
  {
    r1: 0,
    r2: 90,
    r3: -90,
    x: 15,
    y: 0,
    z: 0,
  },
];

let NORMAL_DEFAULT_VALUE = [
  {
    frameType: 'rotary',
    r1: 0,
    r2: 0,
    r3: 0,
    x: 0,
    y: 0,
    z: 0,
    moveFrame: false,
  },
  {
    frameType: 'rotary',
    r1: 90,
    r2: 0,
    r3: 0,
    x: 0,
    y: 0,
    z: 15,
    moveFrame: false,
  },
  {
    frameType: 'rotary',
    r1: 0,
    r2: 0,
    r3: 90,
    x: 0,
    y: 20,
    z: 0,
    moveFrame: false,
  },
  {
    frameType: 'rotary',
    r1: 0,
    r2: 90,
    r3: -90,
    x: 15,
    y: 0,
    z: 0,
    moveFrame: true,
    moveBackBy: -15,
    moveBack: 'x',
  },
  {
    frameType: 'rotary',
    r1: 90,
    r2: 0,
    r3: 0,
    x: 0,
    y: 0,
    z: 15,
    moveFrame: false,
  },
  {
    frameType: 'rotary',
    r1: -90,
    r2: 0,
    r3: 0,
    x: 0,
    y: 15,
    z: 0,
    moveFrame: true,
    moveBackBy: -15,
    moveBack: 'y',
  },
  {
    frameType: 'stationary',
    r1: 0,
    r2: 0,
    r3: 0,
    x: 0,
    y: 0,
    z: 10,
    moveFrame: false,
  },
];

const PT = [
  [0, 90, 0, 'a1'],
  [90, 0, 'a2', 0],
  [90, -90, 0, 0],
  [0, 90, 0, 'a3' + 'a4'],
  [0, -90, 0, 0],
  [0, 0, 0, 'a5' + 'a6'],
];

// UR

const UR_DEFAULT_VALUE = [
  {
    r1: 0,
    r2: 0,
    r3: 0,
    x: 0,
    y: 0,
    z: 0,
    moveFrame: false,
  },
  {
    r1: 90,
    r2: 0,
    r3: 0,
    x: 0,
    y: 0,
    z: 15.185,
    moveFrame: false,
  },
  {
    r1: 0,
    r2: 0,
    r3: 0,
    x: -24.355,
    y: 0,
    z: 0,
    moveFrame: false,
  },
  {
    r1: 0,
    r2: 0,
    r3: 0,
    x: -21.32,
    y: 0,
    z: 0,
    moveFrame: false,
  },
  {
    r1: 90,
    r2: 0,
    r3: 0,
    x: 0,
    y: 0,
    z: 13.105,
    moveFrame: false,
  },
  {
    r1: -90,
    r2: 0,
    r3: 0,
    x: 0,
    y: 0,
    z: 8.535,
    moveFrame: false,
  },
  {
    r1: 0,
    r2: 0,
    r3: 0,
    x: 0,
    y: 0,
    z: 9.21,
    moveFrame: false,
    frameType: 'stationary',
  },
];

const defaultValue = MY_DEFAULT_VALUE;

const FrameInfo = () => {
  const scope = useScope();

  // Get this value and the value before
  const { value: n } = useScopedState();
  const { value: nMinus1 } = useFieldState(decrementFrameIndex(`${scope}`), false);

  // Special case no value yet
  if (!n) return null;

  // // Special case if we dont have values yet
  if (!areAllValuesDefined(n, ['r1', 'r2', 'r3', 'x', 'y', 'z'])) return null;

  // Special case if we are base frame
  if (scope === 'frames[0]') return null;

  // 2 2 = z z see function definition for more details
  const zsParallel = isParallel(n.x, n.y, n.z, n.r1, n.r2, n.r3, 2, 2);

  return (
    <div>
      <strong>Zs Parallel: </strong>
      <span>{JSON.stringify(zsParallel)}</span>
    </div>
  );
};

const FrameControl = () => {
  const { value: type } = useFieldState('eulerType', false);

  // const { value: orientation } = useFieldState('orientation');

  const itemApi = useArrayFieldItemApi();

  // For Building labels
  const [label1, label2, label3] = useMemo(() => {
    if (type) {
      // Example: 'xyz'.split('')
      // => [ 'x', 'y', 'z' ]
      return type.split('').map((l) => `Rotation ${l}`);
    }
    return ['Rotation1', 'Rotation2', 'Rotation3'];
  }, [type]);

  // For setting rotations
  // useEffect(() => {
  //   if (orientation && type) {
  //     const [r1, r2, r3] = getEulers(orientation, type);
  //     itemApi.setValue('r1', r1);
  //     itemApi.setValue('r2', r2);
  //     itemApi.setValue('r3', r3);
  //   }
  // }, [orientation, type]);

  return (
    <>
      <RadioGroup
        label="Frame Type"
        orientation="horizontal"
        name="frameType"
        defaultValue="rotary"
        options={[
          { label: 'Rotary', value: 'rotary' },
          { label: 'Linear', value: 'linear' },
          { label: 'Stationary', value: 'stationary' },
        ]}
      />
      <InputSlider
        name="r1"
        label={label1}
        type="number"
        minValue={-180}
        maxValue={180}
        defaultValue={0}
        step={1}
        validate={validate}
        validateOnMount
        validateWhen={['r2', 'r3', 'x', 'y', 'z', 'moveBackBy']}
        displayError
        validateOn="change"
        showErrorIfError
      />
      <InputSlider
        name="r2"
        label={label2}
        type="number"
        minValue={-180}
        maxValue={180}
        defaultValue={0}
        step={1}
        validate={validate}
        validateOnMount
        validateWhen={['r1', 'r3', 'x', 'y', 'z', 'moveBackBy']}
        displayError
        validateOn="change"
        showErrorIfError
      />
      <InputSlider
        name="r3"
        label={label3}
        type="number"
        minValue={-180}
        maxValue={180}
        defaultValue={0}
        step={1}
        validate={validate}
        validateOnMount
        validateWhen={['r1', 'r2', 'x', 'y', 'z', 'moveBackBy']}
        displayError
        validateOn="change"
        showErrorIfError
      />
      {/* <RadioGroup
        label="Orientation"
        initialValue="z"
        orientation="horizontal"
        name="orientation"
        aria-label="Select Oriantaion"
        options={[
          { label: 'X', value: 'x' },
          { label: '-X', value: '-x' },
          { label: 'Y', value: 'y' },
          { label: '-Y', value: '-y' },
          { label: 'Z', value: 'z' },
          { label: '-Z', value: '-z' },
        ]}
      /> */}
      <InputSlider
        name="x"
        label="X"
        type="number"
        minValue={-100}
        maxValue={100}
        defaultValue={0}
        step={1}
        validate={validate}
        validateOn="change"
        showErrorIfError
        displayError
        validateOnMount
        validateWhen={['r1', 'r2', 'r3', 'y', 'z', 'moveBackBy']}
      />
      <InputSlider
        name="y"
        label="Y"
        type="number"
        minValue={-100}
        maxValue={100}
        defaultValue={0}
        step={1}
        validate={validate}
        validateOn="change"
        showErrorIfError
        displayError
        validateOnMount
        validateWhen={['r1', 'r2', 'r3', 'x', 'z', 'moveBackBy']}
      />
      <InputSlider
        name="z"
        label="Z"
        type="number"
        minValue={-100}
        maxValue={100}
        defaultValue={0}
        step={1}
        validate={validate}
        validateOn="change"
        showErrorIfError
        displayError
        validateOnMount
        validateWhen={['r1', 'r2', 'r3', 'x', 'y', 'moveBackBy']}
      />
      <br />
      <Switch name="moveFrame" label="MoveFrame" defaultValue={false} />
      <br />
      <Relevant when={({ formApi, scope }) => formApi.getValue(`${scope}.moveFrame`)}>
        <RadioGroup
          label="MoveBack"
          orientation="horizontal"
          name="moveBack"
          options={[
            { label: 'X', value: 'x' },
            { label: 'Y', value: 'y' },
            { label: 'Z', value: 'z' },
          ]}
        />
        <InputSlider
          name="moveBackBy"
          label="Move"
          type="number"
          minValue={-100}
          maxValue={100}
          defaultValue={0}
          step={1}
        />
      </Relevant>
    </>
  );
};

const ArrayButtons = ({ index, add, remove, isDisabled }) => {
  const { fields } = useArrayFieldState();

  if (index === fields.length - 1) {
    return (
      <>
        <ActionButton
          title="Remove Waypoint"
          aria-label="Remove Waypoint"
          type="button"
          onClick={remove}
          minWidth={40}
          isDisabled={isDisabled}
        >
          -
        </ActionButton>
        <ActionButton
          onClick={() => {
            add({ z: 30 });
          }}
          type="button"
          minWidth={40}
          title="Add Waypoint"
          aria-label="Add Waypoint"
          isDisabled={isDisabled}
        >
          +
        </ActionButton>
      </>
    );
  }

  return (
    <ActionButton
      title="Remove Waypoint"
      aria-label="Remove Waypoint"
      type="button"
      onClick={remove}
      minWidth={40}
      isDisabled={isDisabled}
    >
      -
    </ActionButton>
  );
};

export const BuilderNav = () => {
  return (
    <>
      <Flex direction="row" alignItems="center" gap="size-100">
        <h1>Builder</h1>
      </Flex>
      <Flex direction="row" gap="size-500">
        <div className="sidenav-controls">
          <ul className="spectrum-SideNav">
            <Select
              label="Euler Type"
              name="eulerType"
              defaultValue="xyz"
              options={[
                { value: 'xyz', label: 'XYZ ( Yaw Pitch Roll )' },
                { value: 'zxz', label: 'ZXZ' },
              ]}
            />
            <InputSlider
              name="cameraX"
              label="Camera X"
              type="number"
              minValue={-500}
              maxValue={500}
              defaultValue={70}
              step={10}
            />
            <InputSlider
              name="cameraY"
              label="Camera Y"
              type="number"
              minValue={-500}
              maxValue={500}
              defaultValue={80}
              step={10}
            />
            <InputSlider
              name="cameraZ"
              label="Camera Z"
              type="number"
              minValue={-500}
              maxValue={500}
              defaultValue={70}
              step={10}
            />
            <InputSlider
              name="cameraZoom"
              label="Camera Zoom"
              type="number"
              minValue={0}
              maxValue={3}
              defaultValue={3}
              step={0.1}
            />
            <br />
            <Switch name="showPlanes" label="Show Planes" initialValue={false} />
            <br />
            <Switch name="showArrows" label="Show Arrows" initialValue={true} />
            <br />
            <Switch name="showCylinder" label="Show Joints" initialValue={true} />
            <br />
            <Switch name="showLinks" label="Show Links" initialValue={false} />
            <br />
            <ArrayField name="frames" defaultValue={defaultValue}>
              {({ add, addWithInitialValue }) => {
                return (
                  <>
                    <ArrayField.Items>
                      {({ remove, name, index }) => (
                        <label>
                          <hr />
                          <h5>{name}</h5>
                          <FrameInfo />
                          <br />
                          <FrameControl />
                          <br />
                          <ArrayButtons index={index} add={addWithInitialValue} remove={remove} />
                        </label>
                      )}
                    </ArrayField.Items>
                  </>
                );
              }}
            </ArrayField>
            <Debug values errors />
          </ul>
        </div>
      </Flex>
    </>
  );
};
