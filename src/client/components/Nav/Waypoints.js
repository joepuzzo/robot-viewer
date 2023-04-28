import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { ActionButton, Flex, ProgressCircle } from '@adobe/react-spectrum';
import useSimulateController from '../../hooks/useSimulateController';
import NumberInput from '../Informed/NumberInput';
import Input from '../Informed/Input';
import Select from '../Informed/Select';
import Switch from '../Informed/Switch';
import {
  ArrayField,
  Debug,
  DebugField,
  Relevant,
  useArrayFieldState,
  useField,
  useFieldState,
  useFormApi,
} from 'informed';
import useSimulateState from '../../hooks/useSimulateState';
import { usetPost } from '../../hooks/usePost';
import { useGet } from '../../hooks/useGet';
import { Draggable, DraggableProvider } from '../Shared/Draggable';
import { If } from '../Shared/If';

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

export const Waypoints = ({ currentWaypoints, column, getAllWaypoints }) => {
  const { play } = useSimulateController();
  const { simulating } = useSimulateState();
  const formApi = useFormApi();
  const { value: waypointLabels } = useFieldState('waypointLabels');

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
  ];

  const arrayFieldApiRef = useRef();

  const [{ data: waypointsData, loading: getLoading, error: getError }, getWaypoints] = useGet();

  const [{ error: postError, loading: postLoading }, postWaypoints] = usetPost({
    headers: { ContentType: 'application/json' },
    onComplete: () => {
      getAllWaypoints({ url: `/waypoints/all` });
    },
  });

  // Use user waypoints or loaded waypoints
  const data = currentWaypoints || waypointsData;

  // For loading and error shit
  const loading = postLoading || getLoading;
  const error = postError || getError;

  // Will save a waypoint by the given name
  const save = useCallback(() => {
    const { values } = formApi.getFormState();

    const { waypoints, filename, selectedAction } = values;

    const name = selectedAction || filename;

    postWaypoints({ payload: waypoints, url: `/waypoints/save/${name}` });
  }, []);

  // Will load a waypoint by the given name
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
    arrayFieldApiRef.current.reset();
  }, [initialValue]);

  return (
    <div className={`waypoints ${column ? 'waypoints-column' : ''}`}>
      <div
        style={{
          flexGrow: '0',
        }}
      >
        {loading ? (
          <div style={{ position: 'fixed', top: '50%', left: '50%', zIndex: '999' }}>
            <ProgressCircle aria-label="Loading…" isIndeterminate size="L" />
          </div>
        ) : null}
        {error ? <span style={{ color: 'red' }}>{JSON.stringify(error)}</span> : null}
        <Flex direction="row" alignItems="end" gap="size-100">
          <ActionButton type="button" onPress={play} minWidth="120px" isDisabled={loading}>
            Run Waypoints
          </ActionButton>
          <br />
          <Switch name="repeat" label="Repeat" initialValue={false} />
        </Flex>
        <br />
        <br />
        <Flex direction="row" alignItems="end" gap="size-100">
          <If condition={!column}>
            <Input name="filename" label="Filename" autocomplete="off" />
          </If>
          <If condition={!column}>
            <ActionButton type="button" onPress={load} minWidth="120px" isDisabled={loading}>
              Load Waypoints
            </ActionButton>
          </If>

          <ActionButton type="button" onPress={save} minWidth="120px" isDisabled={loading}>
            Save Waypoints
          </ActionButton>
          <Switch name="waypointLabels" label="Show Labels" initialValue={false} />
        </Flex>
        <br />
        <br />
        <div>{`Playing: ${JSON.stringify(simulating.play)}, Step: ${simulating.step}`}</div>
      </div>
      {/* <DebugField name="waypoints" /> */}
      <div className="waypoints-array">
        <ArrayField
          name="waypoints"
          defaultValue={defaultValue}
          initialValue={initialValue}
          arrayFieldApiRef={arrayFieldApiRef}
        >
          {({ add, swap: swapper }) => {
            return (
              <Flex direction="column" alignItems="start" gap="size-100">
                <DraggableProvider>
                  <ArrayField.Items>
                    {({ remove, name, index }) => (
                      <Draggable index={index} swapper={swapper}>
                        <div
                          className={`waypoint ${
                            simulating.step - 1 === index && simulating.play ? 'highlight' : ''
                          }`}
                        >
                          <Flex direction="row" alignItems="end" gap="size-100" width={460}>
                            <Input
                              name="label"
                              label="Label"
                              minWidth="110px"
                              hidden={!waypointLabels}
                            />
                            <Switch
                              name="gripper"
                              defaultValue={false}
                              isDisabled={loading}
                              label="Gripper"
                            />
                            <Select
                              isDisabled={loading}
                              width={100}
                              defaultValue="z"
                              name="orientation"
                              label="Orientation"
                              minWidth="110px"
                              aria-label="Select Oriantaion"
                              options={[
                                { label: 'X', value: 'x' },
                                { label: '-X', value: '-x' },
                                { label: 'Y', value: 'y' },
                                { label: '-Y', value: '-y' },
                                { label: 'Z', value: 'z' },
                                { label: '-Z', value: '-z' },
                                { label: 'Custom', value: 'c' },
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
                                formApi.getValue(`${scope}.grip`) == null
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
                              <Relevant
                                when={({ scope, formApi }) =>
                                  formApi.getValue(`${scope}.orientation`) == 'c'
                                }
                              >
                                <NumberInput
                                  name="r1"
                                  label="R1"
                                  hideStepper
                                  defaultValue={0}
                                  width={90}
                                  isDisabled={loading}
                                />
                                <NumberInput
                                  name="r2"
                                  label="R2"
                                  hideStepper
                                  defaultValue={0}
                                  width={90}
                                  isDisabled={loading}
                                />
                                <NumberInput
                                  name="r3"
                                  label="R3"
                                  hideStepper
                                  defaultValue={0}
                                  width={90}
                                  isDisabled={loading}
                                />
                              </Relevant>
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
                              when={({ scope, formApi }) => formApi.getValue(`${scope}.gripper`)}
                            >
                              <Switch
                                name="grip"
                                defaultValue={false}
                                isDisabled={loading}
                                label="Grip"
                              />
                            </Relevant>
                            <ArrayButtons
                              index={index}
                              add={add}
                              remove={remove}
                              isDisabled={loading}
                            />
                          </Flex>
                        </div>
                      </Draggable>
                    )}
                  </ArrayField.Items>
                </DraggableProvider>
              </Flex>
            );
          }}
        </ArrayField>
      </div>
      {/* <Debug values /> */}
    </div>
  );
};
