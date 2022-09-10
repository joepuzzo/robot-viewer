import React, { Suspense } from 'react';
import { OrbitControls } from '@react-three/drei';
import useSimulateController from '../../../hooks/useSimulateController';
import { useFormApi, useFormState } from 'informed';
import useApp from '../../../hooks/useApp';
import { Arm } from '../../3D/Arm';
import { Canvas } from '@react-three/fiber';
import { round } from '../../../../lib/round';
import NumberInput from '../../Informed/NumberInput';
import Switch from '../../Informed/Switch';
import RadioGroup from '../../Informed/RadioGroup';
import { ActionButton, Flex } from '@adobe/react-spectrum';
import useRobotController from '../../../hooks/useRobotController';
import useRobotKinematics from '../../../hooks/useRobotKinematics';

const getZXZ = (orientation) => {
  switch (orientation) {
    case 'x':
      return [90, 90, 90];
    case '-x':
      return [-270, -90, 0];
    case 'y':
      return [0, -90, 0];
    case '-y':
      return [-180, -90, 0];
    case 'z':
      return [0, 0, 0];
    case '-z':
      return [-90, -180, 0];
    default:
      break;
  }
};

const Control = () => {
  const { values } = useFormState();
  const formApi = useFormApi();
  const { updateRobot } = useRobotController();

  const robotUpdate = () => {
    const { goToX, goToY, goToZ, orientation } = formApi.getFormState().values;

    // get rotations from orientation
    const [r1, r2, r3] = getZXZ(orientation);

    // Update the robot
    updateRobot(goToX, goToY, goToZ, r1, r2, r3);
  };

  return (
    <>
      <Flex
        direction="row"
        width={450}
        justifyContent="space-between"
        alignItems="end"
        gap="size-100"
      >
        <NumberInput
          name="goToX"
          label={`X: ${round(values.x, 100)}`}
          step={0.1}
          initialValue={8}
        />
        <NumberInput
          name="goToY"
          label={`Y: ${round(values.y, 100)}`}
          step={0.1}
          initialValue={1}
        />
        <NumberInput
          name="goToZ"
          label={`Z: ${round(values.z, 100)}`}
          step={0.1}
          initialValue={9}
        />
        <ActionButton title="Go" aria-label="Go" type="button" onPress={robotUpdate} minWidth="100">
          Go
        </ActionButton>
        <Switch name="animate" label="Animate" initialValue />
      </Flex>
      <br />
      <RadioGroup
        initialValue="x"
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
    </>
  );
};

export const Robot = () => {
  const { config, orbitEnabled, toggleOrbital } = useApp();

  const { values } = useFormState();
  const formApi = useFormApi();
  const simulateController = useSimulateController();
  const robotController = useRobotController();
  const { endPosition } = useRobotKinematics();

  const { j0, j1, j2, j3, j4, j5 } = values;

  const angles = [j0, j1, j2, j3, j4, j5];

  return (
    <>
      <h3>
        Angles:{' '}
        {JSON.stringify(
          angles.map((a) => round(a, 100)),
          null,
          2
        )}
      </h3>
      <h3>
        Location: X: {round(endPosition.x, 10000)} Y: {round(endPosition.y, 10000)} Z:{' '}
        {round(endPosition.z, 10000)}
      </h3>
      {/* <pre>{JSON.stringify(endPosition.matrix[0])}</pre>
      <pre>{JSON.stringify(endPosition.matrix[1])}</pre>
      <pre>{JSON.stringify(endPosition.matrix[2])}</pre> */}
      {/* <h4>Movements: {robot.movements}</h4> */}
      <Control />
      <Canvas
        camera={{
          fov: 75,
          aspect: window.innerWidth / window.innerHeight,
          near: 0.1,
          far: 1000,
          position: [8, 12, 10],
          zoom: 0.8,
        }}
      >
        <OrbitControls enabled={orbitEnabled} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[-2, 5, 2]} intensity={1} />
        <Suspense fallback={null}>
          <Arm
            simulateController={simulateController}
            robotController={robotController}
            config={config}
            values={values}
            formApi={formApi}
            toggleOrbital={toggleOrbital}
          />
        </Suspense>
      </Canvas>
    </>
  );
};
