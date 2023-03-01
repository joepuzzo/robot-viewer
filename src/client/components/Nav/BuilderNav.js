import React, { useEffect, useMemo } from 'react';
import { ActionButton, Flex } from '@adobe/react-spectrum';

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
  useFormState,
} from 'informed';
import { RobotType } from '../Shared/RobotType';
import { If } from '../Shared/If';
import { isParallel, isPerpendicular, xIntersectsZ } from '../../utils/frame';

function areAllValuesDefined(obj = {}, keys) {
  return keys.every((key) => obj[key] != null);
}

// decrementFrameIndex("frames[2]");  // Returns "frames[1]"
// decrementFrameIndex("frames[5]");  // Returns "frames[4]"
// decrementFrameIndex("frames[0]");  // Returns "frames[-1]"
function decrementFrameIndex(string) {
  return string.replace(/\[(\d+)\]/, (_, number) => `[${Number(number) - 1}]`);
}

const validate = (value, values, { formApi, scope }) => {
  // Get this value and the value before
  const n = formApi.getValue(`${scope}`);
  const nMinus1 = formApi.getValue(decrementFrameIndex(`${scope}`));

  // Special case no value yet
  if (!n) return;

  // Special case if we dont have values yet
  if (!areAllValuesDefined(n, ['r1', 'r2', 'r3', 'x', 'y', 'z'])) return;

  // Special case if we are base frame
  if (!nMinus1) return;

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
  if (!isPerpendicular(x, y, z, n.r1, n.r2, n.r3, 'x', 'z')) {
    return 'X axis must be perpendicular to the previous z axis';
  }

  // Each X axis must intersect the Z axis of the frame before it ( except frame 0 )
  if (!xIntersectsZ(x, y, z, n.r1, n.r2, n.r3)) {
    return 'X axis must intersect the previous z axis';
  }
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

let PARALLEL_X = [
  {
    frameType: 'rotary',
    r1: 90,
    r2: 0,
    r3: 90,
    x: 0,
    y: 0,
    z: 0,
    moveFrame: false,
  },
  {
    frameType: 'rotary',
    r1: 0,
    r2: 0,
    r3: 0,
    x: 20,
    y: 0,
    z: 0,
    moveFrame: false,
  },
];

let Parallel_Y = [
  {
    frameType: 'rotary',
    r1: 90,
    r2: 0,
    r3: 0,
    x: 0,
    y: 0,
    z: 0,
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
];

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
  const zsParallel = isParallel(n.x, n.y, n.z, n.r1, n.r2, n.r3, 'z', 'z');
  const xyParallel = isParallel(n.x, n.y, n.z, n.r1, n.r2, n.r3, 'x', 'y');

  return (
    <>
      <div>
        <strong>Zs Parallel: </strong>
        <span>{JSON.stringify(zsParallel)}</span>
      </div>
      <div>
        <strong>XYs Parallel: </strong>
        <span>{JSON.stringify(xyParallel)}</span>
      </div>
    </>
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
  const { values, initialValues } = useFormState();

  const defaultZoom = 6 / initialValues.frames.length;

  return (
    <>
      <Flex direction="row" alignItems="center" gap="size-100">
        <h1>Builder</h1>
      </Flex>
      <Flex direction="row" gap="size-500">
        <div className="sidenav-controls">
          <ul className="spectrum-SideNav">
            <br />
            <RobotType filter={(robot) => robot.frames} />
            <br />
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
              maxValue={6}
              defaultValue={defaultZoom}
              step={0.1}
            />
            <InputSlider
              name="gridSize"
              initialValue={100}
              label="Grid Size"
              type="number"
              minValue={0}
              maxValue={300}
              step={10}
            />

            <br />
            <Switch name="mainGrid" label="Main Grid" initialValue={false} />
            <br />
            <Switch name="showPlanes" label="Show Planes" initialValue={false} />
            <br />
            <Switch name="showArrows" label="Show Arrows" initialValue={true} />
            <br />
            <Switch name="showCylinder" label="Show Joints" initialValue={true} />
            <br />
            <Switch name="showLinks" label="Show Links" initialValue={false} />
            <br />
            <Switch name="showLines" label="Show Lines" initialValue={false} />
            <br />
            <Switch name="hide" label="Hide Robot" initialValue={false} />
            <br />
            <hr />
            <InputSlider
              name="endEffector"
              label="End Effector"
              type="number"
              minValue={-100}
              maxValue={100}
              defaultValue={0}
              step={1}
              trackGradient="rgb(204, 44, 117)"
            />
            <InputSlider
              name="base"
              label="Base"
              type="number"
              minValue={0}
              maxValue={100}
              step={0.1}
              trackGradient="black"
              initialValue={0}
            />
            <If condition={values.frames}>
              <>
                {values.frames &&
                  values.frames.map((frame, i) => (
                    <InputSlider
                      name={`j${i}`}
                      label={`J${i}`}
                      type="number"
                      minValue={-180}
                      maxValue={180}
                      step={1}
                      initialValue={0}
                    />
                  ))}
              </>
            </If>
            <ArrayField name="frames" defaultValue={DEFAULT_VALUE}>
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
