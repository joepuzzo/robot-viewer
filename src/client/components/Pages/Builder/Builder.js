import React, { Suspense, useContext, useMemo, useRef, useState } from 'react';
import { OrbitControls } from '@react-three/drei';
import Grid from '../../3D/Grid';
import { Canvas } from '@react-three/fiber';
import { Text } from '@react-three/drei';

import RadioGroup from '../../Informed/RadioGroup';
import { ActionButton, Flex } from '@adobe/react-spectrum';
import useApp from '../../../hooks/useApp';
import { useFieldState, useFormApi, useFormState } from 'informed';
import { toRadians } from '../../../../lib/toRadians';
import { useSpring, animated } from '@react-spring/three';
import { getEulers } from '../../../utils/getEulers';

const Joint = ({ index, value }) => {
  const prefix = `frames[${index}]`;

  // console.log('WTF', `${prefix}.r1`);

  // const { value: rot1 } = useFieldState(`${prefix}.r1`);
  // const { value: rot2 } = useFieldState(`${prefix}.r2`);
  // const { value: rot3 } = useFieldState(`${prefix}.r3`);
  const rot1 = value.r1;
  const rot2 = value.r2;
  const rot3 = value.r3;
  const { x, y, z } = value;

  const { value: type } = useFieldState(`eulerType`);

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

  // const foo = `${rot1} ${rot1} ${rot1}`;

  return (
    <group position={[x, y, z]}>
      <Text
        color="white" // default
        anchorX="center" // default
        anchorY="middle" // default
        position={[0, -10, 0]}
        scale={[40, 40, 40]}
      >
        {prefix}
      </Text>
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
  );
};

export const Builder = () => {
  const controlRef = useRef();

  const { orbitEnabled } = useApp();

  const { values } = useFormState();

  const value = values?.frames;

  return (
    <>
      <Canvas
        camera={{
          fov: 75,
          aspect: window.innerWidth / window.innerHeight,
          near: 0.1,
          far: 10000,
          position: [70, 80, 70],
          zoom: 1.5,
        }}
      >
        <OrbitControls enabled={orbitEnabled} ref={controlRef} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[-2, 5, 2]} intensity={1} />
        <Suspense fallback={null}>
          <group rotation={[Math.PI * -0.5, 0, 0]}>
            {value ? value.map((v, i) => <Joint index={i} value={v} key={`joint-${i}`} />) : null}
          </group>
        </Suspense>
      </Canvas>
    </>
  );
};