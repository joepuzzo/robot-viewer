import React from 'react';
import { ActionButton, Flex } from '@adobe/react-spectrum';
import useSimulateController from '../../hooks/useSimulateController';
import NumberInput from '../Informed/NumberInput';
import Select from '../Informed/Select';
import Switch from '../Informed/Switch';
import { ArrayField, Relevant, useArrayFieldState } from 'informed';
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

  // const initialValue = [
  //   {
  //     x: 30,
  //     y: 10,
  //     z: 60,
  //     orientation: 'x',
  //   },
  //   {
  //     x: 30,
  //     y: -10,
  //     z: 60,
  //     orientation: 'x',
  //   },
  //   {
  //     x: -30,
  //     y: 10,
  //     z: 60,
  //     orientation: '-x',
  //   },
  //   {
  //     x: 50,
  //     y: 0,
  //     z: 0,
  //     orientation: '-z',
  //   },
  //   {
  //     x: 30,
  //     y: -10,
  //     z: 60,
  //     orientation: 'x',
  //   },
  //   {},
  // ];

  const initialValue = [
    {
      x: 30,
      y: 20,
      z: 10,
      orientation: '-z',
    },
    {
      x: 40,
      y: 20,
      z: 10,
      orientation: '-z',
    },
    {
      x: 50,
      y: 20,
      z: 10,
      orientation: '-z',
    },
    {
      x: 30,
      y: 0,
      z: 10,
      orientation: '-z',
    },
    {
      x: 40,
      y: 0,
      z: 10,
      orientation: '-z',
    },
    {
      x: 50,
      y: 0,
      z: 10,
      orientation: '-z',
    },
    {
      x: 30,
      y: -20,
      z: 10,
      orientation: '-z',
    },
    {
      x: 40,
      y: -20,
      z: 10,
      orientation: '-z',
    },
    {
      x: 50,
      y: -20,
      z: 10,
      orientation: '-z',
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
                    className={`waypoint ${
                      simulating.step - 1 === index && simulating.play ? 'highlight' : ''
                    }`}
                  >
                    <Flex direction="row" alignItems="end" gap="size-100" width={460}>
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
                          { label: 'G', value: 'g' },
                        ]}
                      />
                      <NumberInput
                        name="wait"
                        label="Hold"
                        hideStepper
                        defaultValue={0}
                        width={80}
                      />
                      <Relevant
                        when={({ scope, formApi }) =>
                          formApi.getValue(`${scope}.orientation`) != 'g'
                        }
                      >
                        <NumberInput name="x" label="X" hideStepper defaultValue={0} width={90} />
                        <NumberInput name="y" label="Y" hideStepper defaultValue={0} width={90} />
                        <NumberInput name="z" label="Z" hideStepper defaultValue={0} width={90} />
                        {/* <NumberInput name="r1" label="R1" hideStepper defaultValue={0} />
                    <NumberInput name="r2" label="R2" hideStepper defaultValue={0} />
                    <NumberInput name="r3" label="R3" hideStepper defaultValue={0} /> */}
                        <NumberInput
                          name="speed"
                          label="Speed"
                          hideStepper
                          defaultValue={1500}
                          width={90}
                        />
                      </Relevant>
                      <Relevant
                        when={({ scope, formApi }) =>
                          formApi.getValue(`${scope}.orientation`) === 'g'
                        }
                      >
                        <Switch name="grip" initialValue={false} />
                      </Relevant>
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
