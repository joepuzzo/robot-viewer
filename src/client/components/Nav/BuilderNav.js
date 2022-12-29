import React, { useEffect, useMemo } from 'react';
import { ActionButton, Flex } from '@adobe/react-spectrum';

import Select from '../Informed/Select';
import InputSlider from '../Informed/InputSlider';
import RadioGroup from '../Informed/RadioGroup';
import {
  ArrayField,
  useFieldState,
  useArrayFieldState,
  useArrayFieldItemApi,
  Debug,
} from 'informed';
import { getEulers } from '../../utils/getEulers';
import { matrixDot } from '../../../lib/matrixDot';

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

function isXZPerpendicular(dx, dy, dz, rx_deg, ry_deg, rz_deg) {
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

  // console.table(transform);

  // Check if the x axis of the new frame is perpendicular to the z axis of the previous frame
  return Math.abs(transform[2][0]) === 0;
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

  // Extract the x and z axes of the new frame from the transform matrix
  let xAxis = [transform[0][0], transform[1][0], transform[2][0]];
  let zAxis = [transform[0][2], transform[1][2], transform[2][2]];

  // Check if the x and z axes are collinear
  return areCollinear(xAxis, zAxis);
}

function areCollinear(v1, v2) {
  // Check if the x and z axes are collinear
  return Math.abs(angleBetween(v1, v2)) === 0 || Math.abs(angleBetween(v1, v2)) === Math.PI;
}

function angleBetween(v1, v2) {
  // Calculate the dot product and magnitudes of the vectors
  let dotProduct = v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
  let magnitude1 = Math.sqrt(v1[0] * v1[0] + v1[1] * v1[1] + v1[2] * v1[2]);
  let magnitude2 = Math.sqrt(v2[0] * v2[0] + v2[1] * v2[1] + v2[2] * v2[2]);

  // Return the angle between the vectors
  return Math.acos(dotProduct / (magnitude1 * magnitude2));
}

const validate = (value, values, { formApi, scope }) => {
  // Get this value and the value before
  const n = formApi.getValue(`${scope}`);
  const nMinus1 = formApi.getValue(decrementFrameIndex(`${scope}`));

  // Special case no value yet
  if (!n) return;

  // console.log('---------------------------------------');
  // console.log(`${scope}`, JSON.stringify(n));
  // console.log(`${scope} - 1`, JSON.stringify(nMinus1));

  // Special case if we dont have values yet
  if (n.r1 === undefined || n.r2 === undefined || n.r3 === undefined) return;

  // Special case if we are base frame
  if (!nMinus1) return;

  // console.log('RES', isXZPerpendicular(n.x, n.y, n.z, n.r1, n.r2, n.r3));

  // The X axis must be perpendicular to the Z axis of the frame before it
  if (!isXZPerpendicular(n.x, n.y, n.z, n.r1, n.r2, n.r3))
    return 'X axis must be perpendicular to z axis';

  // Each X axis must intersect the Z axis of the frame before it ( except frame 0 )
  // if (!xIntersectsZ((n.x, n.y, n.z, n.r1, n.r2, n.r3))) return 'X axis must intersect z axis';
};

const FrameControl = () => {
  const { value: type } = useFieldState('eulerType', false);

  const { value: orientation } = useFieldState('orientation');

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
  useEffect(() => {
    if (orientation && type) {
      const [r1, r2, r3] = getEulers(orientation, type);
      itemApi.setValue('r1', r1);
      itemApi.setValue('r2', r2);
      itemApi.setValue('r3', r3);
    }
  }, [orientation, type]);

  return (
    <>
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
        validateWhen={['r2', 'r3']}
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
        validateWhen={['r1', 'r3']}
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
        validateWhen={['r1', 'r2']}
      />
      <RadioGroup
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
      />
      <InputSlider
        name="x"
        label="X"
        type="number"
        minValue={-100}
        maxValue={100}
        defaultValue={0}
        step={1}
      />
      <InputSlider
        name="y"
        label="Y"
        type="number"
        minValue={-100}
        maxValue={100}
        defaultValue={0}
        step={1}
      />
      <InputSlider
        name="z"
        label="Z"
        type="number"
        minValue={-100}
        maxValue={100}
        defaultValue={0}
        step={1}
      />
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
            <ArrayField name="frames" defaultValue={[{}]}>
              {({ add, addWithInitialValue }) => {
                return (
                  <>
                    <ArrayField.Items>
                      {({ remove, name, index }) => (
                        <label>
                          <hr />
                          <h5>{name}</h5>
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
