import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { OrbitControls } from '@react-three/drei';
import Grid from '../../3D/Grid';
import { Canvas } from '@react-three/fiber';

import Switch from '../../Informed/Switch';
import RadioGroup from '../../Informed/RadioGroup';
import { ActionButton, Flex } from '@adobe/react-spectrum';
import useApp from '../../../hooks/useApp';
import { useFieldState, useFormApi } from 'informed';
import { toRadians } from '../../../../lib/toRadians';

// Z = roll
// Y = pitch
// X = yaw

/**
 *
 * X = Yaw
 * Y = pitch
 * Z = roll
 *
 *       Z
 *       ^
 *       |
 *       |
 *       |
 *       |
 *       + -----------> Y
 *      /
 *     /
 *    /
 *   X
 *
 */

const getRollPitchYaw = (orientation) => {
  switch (orientation) {
    case 'x':
      return [0, 90, 0];
    case '-x':
      return [0, -90, 0];
    case 'y':
      return [-90, 0, 0];
    case '-y':
      return [90, 0, 0];
    case 'z':
      return [0, 0, 0];
    case '-z':
      return [0, 180, 0];
    default:
      break;
  }
};

const Control = ({ controlRef }) => {
  const formApi = useFormApi();
  const reset = () => {
    controlRef.current.reset();
    formApi.reset();
  };

  return (
    <>
      <Flex direction="row" width={500} justifyContent="center" alignItems="end" gap="size-100">
        <ActionButton type="button" onPress={reset} minWidth="100">
          Reset
        </ActionButton>
      </Flex>
      <br />
      <RadioGroup
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
    </>
  );
};

export const Framer = () => {
  const controlRef = useRef();

  const { config, orbitEnabled, toggleOrbital } = useApp();

  const formApi = useFormApi();

  const { value: orientation } = useFieldState('orientation');
  const { value: roll } = useFieldState('roll');
  const { value: pitch } = useFieldState('pitch');
  const { value: yaw } = useFieldState('yaw');

  const [rotation, setRotation] = useState([0, 0, 0]);

  useEffect(() => {
    if (orientation) {
      const [x, y, z] = getRollPitchYaw(orientation);
      formApi.setTheseValues({
        yaw: x,
        pitch: y,
        roll: z,
      });
    }
  }, [orientation]);

  useEffect(() => {
    setRotation([toRadians(yaw), toRadians(pitch), toRadians(roll)]);
  }, [yaw, pitch, roll]);

  return (
    <>
      <Control controlRef={controlRef} />
      <Canvas
        camera={{
          fov: 75,
          aspect: window.innerWidth / window.innerHeight,
          near: 0.5,
          far: 10000,
          position: [70, 80, 70],
          zoom: 3,
        }}
      >
        <OrbitControls enabled={orbitEnabled} ref={controlRef} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[-2, 5, 2]} intensity={1} />
        <Suspense fallback={null}>
          <group rotation={[Math.PI * -0.5, 0, 0]}>
            <Grid size={40} hideNegatives hidePosatives showArrows showPlanes={false} transparent />
            <group rotation={rotation}>
              <Grid
                size={20}
                hideNegatives
                showArrows
                showPlanes={false}
                lineWidth={5}
                showCylinder
              />
            </group>
          </group>
        </Suspense>
      </Canvas>
    </>
  );
};
