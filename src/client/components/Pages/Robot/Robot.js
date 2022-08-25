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
import { inverse } from '../../../../lib/inverse';
import { toRadians } from '../../../../lib/toRadians';
import { ActionButton, Flex } from '@adobe/react-spectrum';
import { toDeg } from '../../../../lib/toDeg';

const getZXZ = (orientation) => {
  switch (orientation) {
    case 'x':
      return [-90, -90, 0];
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

  const updateRobot = () => {
    const { base, v0, v1, v2, v3, v4, v5, goToX, goToY, goToZ, orientation } =
      formApi.getFormState().values;

    const [r1, r2, r3] = getZXZ(orientation);

    // We give in degrees so turn into rads
    const ro1 = toRadians(r1);
    const ro2 = toRadians(r2);
    const ro3 = toRadians(r3);

    const angles = inverse(goToX, goToY, goToZ, ro1, ro2, ro3, {
      // a1: base + 0.5 + v0 + 1.5, // 4
      // a2: v1 + 2, // 3
      // a3: v2 + 1.5, // 2.5
      // a4: v3 + 1.5, // 2.5
      // a5: v4 + 1, // 2.5
      // a6: v5 + 1.5, // 2.5
      a1: base + v0,
      a2: v1,
      a3: v2,
      a4: v3,
      a5: v4,
      a6: v5,
    });

    console.log('Setting angles to', angles);

    if (!angles.find((a) => isNaN(a))) {
      formApi.setTheseValues({
        j0: toDeg(angles[0]),
        j1: toDeg(angles[1]),
        j2: toDeg(angles[2]),
        j3: toDeg(angles[3]),
        j4: toDeg(angles[4]),
        j5: toDeg(angles[5]),
        x: goToX,
        y: goToY,
        z: goToZ,
        r1,
        r2,
        r3,
      });
    }
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
          initialValue={6}
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
        <ActionButton title="Go" aria-label="Go" type="button" onPress={updateRobot} minWidth="100">
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
            robotController={simulateController}
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
