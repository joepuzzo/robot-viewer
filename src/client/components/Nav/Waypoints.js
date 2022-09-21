import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { ActionButton, Flex, ProgressCircle } from '@adobe/react-spectrum';
import useSimulateController from '../../hooks/useSimulateController';
import NumberInput from '../Informed/NumberInput';
import Select from '../Informed/Select';
import Switch from '../Informed/Switch';
import Input from '../Informed/Input';
import { ArrayField, Debug, Relevant, useArrayFieldState, useFormApi } from 'informed';
import useSimulateState from '../../hooks/useSimulateState';
import { usetPost } from '../../hooks/usePost';
import { useGet } from '../../hooks/useGet';

const ArrayButtons = ({ index, add, remove, isDisabled }) => {
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
        isDisabled={isDisabled}
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
      isDisabled={isDisabled}
    >
      -
    </ActionButton>
  );
};

export const Waypoints = () => {
  const { play } = useSimulateController();
  const { simulating } = useSimulateState();
  const formApi = useFormApi();

  // const defaultValue = [
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

  const defaultValue = [
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

  const arrayFieldApiRef = useRef();

  const [{ error: postError, loading: postLoading }, postWaypoints] = usetPost({
    headers: { ContentType: 'application/json' },
  });

  const [{ data, loading: getLoading, error: getError }, getWaypoints] = useGet();

  const loading = postLoading || getLoading;
  const error = postError || getError;

  const save = useCallback(() => {
    const { values } = formApi.getFormState();

    const { waypoints, filename } = values;

    postWaypoints({ payload: waypoints, url: `/waypoints/save/${filename}` });
  }, []);

  const load = useCallback(() => {
    const { values } = formApi.getFormState();

    const { filename } = values;

    getWaypoints({ url: `/waypoints/load/${filename}` });
  }, []);

  // Build new initial values from data
  const initialValue = useMemo(() => {
    if (data) return data;
  }, [data]);

  // Reset the array field
  useEffect(() => {
    console.log('WTF', initialValue);
    arrayFieldApiRef.current.reset();
  }, [initialValue]);

  return (
    <div className="waypoints">
      {loading ? (
        <div style={{ position: 'fixed', top: '50%', left: '50%', zIndex: '999' }}>
          <ProgressCircle aria-label="Loading…" isIndeterminate size="L" />
        </div>
      ) : null}
      {error ? <span style={{ color: 'red' }}>{JSON.stringify(error)}</span> : null}
      <ActionButton type="button" onPress={play} minWidth="100" isDisabled={loading}>
        Run Waypoints
      </ActionButton>
      <br />
      <br />
      <Flex direction="row" alignItems="end" gap="size-100">
        <Input name="filename" label="Filename" placeholder="pickup-cup" autocomplete="off" />
        <ActionButton type="button" onPress={load} minWidth="100" isDisabled={loading}>
          Load Waypoints
        </ActionButton>
        <ActionButton type="button" onPress={save} minWidth="100" isDisabled={loading}>
          Save Waypoints
        </ActionButton>
      </Flex>
      <br />
      <br />
      <div>{`Playing: ${JSON.stringify(simulating.play)}, Step: ${simulating.step}`}</div>
      <br />
      {/* <Debug values /> */}
      <ArrayField
        name="waypoints"
        defaultValue={defaultValue}
        initialValue={initialValue}
        arrayFieldApiRef={arrayFieldApiRef}
      >
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
                        isDisabled={loading}
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
                        isDisabled={loading}
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
                        <NumberInput
                          name="x"
                          label="X"
                          hideStepper
                          defaultValue={0}
                          width={90}
                          isDisabled={loading}
                        />
                        <NumberInput
                          name="y"
                          label="Y"
                          hideStepper
                          defaultValue={0}
                          width={90}
                          isDisabled={loading}
                        />
                        <NumberInput
                          name="z"
                          label="Z"
                          hideStepper
                          defaultValue={0}
                          width={90}
                          isDisabled={loading}
                        />
                        {/* <NumberInput name="r1" label="R1" hideStepper defaultValue={0} />
                    <NumberInput name="r2" label="R2" hideStepper defaultValue={0} />
                    <NumberInput name="r3" label="R3" hideStepper defaultValue={0} /> */}
                        <NumberInput
                          name="speed"
                          label="Speed"
                          hideStepper
                          defaultValue={1500}
                          width={90}
                          isDisabled={loading}
                        />
                      </Relevant>
                      <Relevant
                        when={({ scope, formApi }) =>
                          formApi.getValue(`${scope}.orientation`) === 'g'
                        }
                      >
                        <Switch name="grip" initialValue={false} isDisabled={loading} />
                      </Relevant>
                      <ArrayButtons index={index} add={add} remove={remove} isDisabled={loading} />
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
