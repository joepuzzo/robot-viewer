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
      />
      <InputSlider
        name="r2"
        label={label2}
        type="number"
        minValue={-180}
        maxValue={180}
        defaultValue={0}
        step={1}
      />
      <InputSlider
        name="r3"
        label={label3}
        type="number"
        minValue={-180}
        maxValue={180}
        defaultValue={0}
        step={1}
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
        minValue={-10}
        maxValue={10}
        defaultValue={0}
        step={1}
      />
      <InputSlider
        name="y"
        label="Y"
        type="number"
        minValue={-10}
        maxValue={10}
        defaultValue={0}
        step={1}
      />
      <InputSlider
        name="z"
        label="Z"
        type="number"
        minValue={-10}
        maxValue={10}
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
            add();
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
              {({ add }) => {
                return (
                  <>
                    <ArrayField.Items>
                      {({ remove, name, index }) => (
                        <label>
                          <h5>{name}</h5>
                          <FrameControl />
                          <br />
                          <ArrayButtons index={index} add={add} remove={remove} />
                        </label>
                      )}
                    </ArrayField.Items>
                  </>
                );
              }}
            </ArrayField>
            <Debug values />
          </ul>
        </div>
      </Flex>
    </>
  );
};
