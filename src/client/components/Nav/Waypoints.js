import React from 'react';
import { ActionButton, Flex } from '@adobe/react-spectrum';
import useSimulateController from '../../hooks/useSimulateController';
import NumberInput from '../Informed/NumberInput';
import Select from '../Informed/Select';
import { ArrayField, useArrayFieldState } from 'informed';
import useSimulateState from '../../hooks/useSimulateState';

const ArrayButtons = ({ index, add, remove }) => {
  const { fields } = useArrayFieldState();

  if (index === fields.length - 1) {
    return (
      <ActionButton
        onClick={() => {
          add();
        }}
        type="button"
        minWidth={40}
        title="Add Waypoint"
        aria-label="Add Waypoint"
      >
        +
      </ActionButton>
    );
  }

  return (
    <ActionButton
      title="Remove Waypoint"
      aria-label="Remove Waypoint"
      type="button"
      onClick={remove}
      minWidth={40}
    >
      -
    </ActionButton>
  );
};

export const Waypoints = () => {
  const { play } = useSimulateController();
  const { simulating } = useSimulateState();

  const initialValue = [
    {
      x: 6,
      y: 1,
      z: 9,
      orientation: 'x',
    },
    {
      x: 6,
      y: -1,
      z: 9,
      orientation: 'x',
    },
    {
      x: -6,
      y: 1,
      z: 9,
      orientation: '-x',
    },
    {
      x: 7,
      y: 0,
      z: 0,
      orientation: '-z',
    },
    {
      x: 7,
      y: -1,
      z: 9.5,
      orientation: 'x',
    },
    {},
  ];

  return (
    <div className="waypoints">
      <ActionButton title="Go" aria-label="Go" type="button" onPress={play} minWidth="100">
        Run Simulation
      </ActionButton>
      <br />
      <br />
      <div>{`Playing: ${JSON.stringify(simulating.play)}, Step: ${simulating.step}`}</div>
      <br />
      <ArrayField name="waypoints" initialValue={initialValue}>
        {({ add }) => {
          return (
            <Flex direction="column" alignItems="center" gap="size-100">
              <ArrayField.Items>
                {({ remove, name, index }) => (
                  <div
                    className={simulating.step - 1 === index && simulating.play ? 'highlight' : ''}
                  >
                    <Flex direction="row" alignItems="end" gap="size-100" width={400}>
                      <NumberInput name="x" label="X" hideStepper defaultValue={0} />
                      <NumberInput name="y" label="Y" hideStepper defaultValue={0} />
                      <NumberInput name="z" label="Z" hideStepper defaultValue={0} />
                      {/* <NumberInput name="r1" label="R1" hideStepper defaultValue={0} />
                    <NumberInput name="r2" label="R2" hideStepper defaultValue={0} />
                    <NumberInput name="r3" label="R3" hideStepper defaultValue={0} /> */}
                      <Select
                        width={100}
                        defaultValue="z"
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
                      <ArrayButtons index={index} add={add} remove={remove} />
                    </Flex>
                  </div>
                )}
              </ArrayField.Items>
            </Flex>
          );
        }}
      </ArrayField>
    </div>
  );
};
