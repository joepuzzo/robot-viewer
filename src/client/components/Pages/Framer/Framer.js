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
import { useSpring, animated } from '@react-spring/three';

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

const orientations = {
  xyz: {
    x: [0, 90, 0],
    '-x': [0, -90, 0],
    y: [-90, 0, 0],
    '-y': [90, 0, 0],
    z: [0, 0, 0],
    '-z': [0, 180, 0],
  },
  zxz: {
    x: [90, 90, 90],
    '-x': [-270, -90, -90],
    y: [0, -90, 0],
    '-y': [-180, -90, 0],
    z: [0, 0, 0],
    // '-z': [90, 180, 0],
    '-z': [-90, -180, 0],
    // '-z': [180, 180, 90],
  },
};

const getRotations = (orientation, type) => {
  console.log('WTF', orientation, type);
  return orientations[type][orientation];
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
  const { value: rot1 } = useFieldState('r1');
  const { value: rot2 } = useFieldState('r2');
  const { value: rot3 } = useFieldState('r3');
  const { value: type } = useFieldState('eulerType');

  const [rotation, setRotation] = useState([0, 0, 0]);

  useEffect(() => {
    if (orientation && type) {
      const [r1, r2, r3] = getRotations(orientation, type);
      formApi.setTheseValues({
        r1,
        r2,
        r3,
      });
    }
  }, [orientation, type]);

  // useEffect(() => {
  //   setRotation([toRadians(rot1), toRadians(rot2), toRadians(rot3)]);
  // }, [rot1, rot2, rot3]);

  const [r1, r2, r3] = useMemo(() => {
    const r1 = { x: 0, y: 0, z: 0 };
    const r2 = { x: 0, y: 0, z: 0 };
    const r3 = { x: 0, y: 0, z: 0 };

    if (type) {
      // Example: 'xyz'.split('')
      // => [ 'x', 'y', 'z' ]
      const rotations = type.split('');

      // Example: r1['x']
      r1[rotations[0]] = toRadians(rot1);
      r2[rotations[1]] = toRadians(rot2);
      r3[rotations[2]] = toRadians(rot3);
    }

    return [Object.values(r1), Object.values(r2), Object.values(r3)];
  }, [type, rot1, rot2, rot3]);

  const { rotation: rotation1 } = useSpring({
    rotation: r1,
    config: {
      clamp: true,
      tension: 70,
    },
  });

  const { rotation: rotation2 } = useSpring({
    rotation: r2,
    config: {
      clamp: true,
      tension: 70,
    },
  });

  const { rotation: rotation3 } = useSpring({
    rotation: r3,
    config: {
      clamp: true,
      tension: 70,
    },
  });

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
            <animated.group rotation={rotation1}>
              <animated.group rotation={rotation2}>
                <animated.group rotation={rotation3}>
                  <Grid
                    size={20}
                    hideNegatives
                    showArrows
                    showPlanes={false}
                    lineWidth={5}
                    showCylinder
                  />
                </animated.group>
              </animated.group>
            </animated.group>
          </group>
        </Suspense>
      </Canvas>
    </>
  );
};
