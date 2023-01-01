import React, { Suspense, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
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

const ErrorBall = () => {
  return (
    <mesh>
      <sphereBufferGeometry args={[10, 30, 30]} />
      <meshStandardMaterial color="#880808" opacity={0.4} transparent />
    </mesh>
  );
};

const Joint = ({ index, value, error, frames, frameErrors }) => {
  const prefix = `frames[${index}]`;

  // console.log('WTF', `${prefix}.r1`);

  // const { value: rot1 } = useFieldState(`${prefix}.r1`);
  // const { value: rot2 } = useFieldState(`${prefix}.r2`);
  // const { value: rot3 } = useFieldState(`${prefix}.r3`);
  const rot1 = value.r1;
  const rot2 = value.r2;
  const rot3 = value.r3;
  const { x, y, z, moveBack, moveBackBy } = value;

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

  const moveBackPos = [0, 0, 0];

  if (moveBack === 'x') moveBackPos[0] = moveBackPos[0] + moveBackBy;
  if (moveBack === '-x') moveBackPos[0] = moveBackPos[0] - moveBackBy;

  if (moveBack === 'y') moveBackPos[1] = moveBackPos[1] + moveBackBy;
  if (moveBack === '-y') moveBackPos[1] = moveBackPos[1] - moveBackBy;

  if (moveBack === 'z') moveBackPos[2] = moveBackPos[2] + moveBackBy;
  if (moveBack === '-z') moveBackPos[2] = moveBackPos[2] - moveBackBy;

  return (
    <group position={[x, y, z]}>
      {/* <Text
        color="white" // default
        anchorX="center" // default
        anchorY="middle" // default
        position={[0, -10, 0]}
        scale={[40, 40, 40]}
      >
        {prefix} {JSON.stringify(moveBackPos)}
      </Text> */}
      {/* <Grid size={40} hideNegatives hidePosatives showArrows showPlanes={false} transparent /> */}
      {moveBack ? (
        <group position={moveBackPos}>
          <animated.group rotation={rotation1}>
            <animated.group rotation={rotation2}>
              <animated.group rotation={rotation3}>
                <Grid
                  size={20}
                  hideNegatives
                  showArrows
                  showPlanes={false}
                  lineWidth={5}
                  axisLabel={index}
                  transparent
                />
              </animated.group>
            </animated.group>
          </animated.group>
        </group>
      ) : null}
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
              axisLabel={index}
            />
            {frames.length ? (
              <Joint
                index={index + 1}
                value={frames[0]}
                error={frameErrors[0]}
                frames={frames.slice(1, frames.length)}
                frameErrors={frameErrors.slice(1, frameErrors.length)}
              />
            ) : null}
            {error ? <ErrorBall /> : null}
          </animated.group>
        </animated.group>
      </animated.group>
    </group>
  );
};

const Control = ({ controlRef, virtualCam }) => {
  const reset = () => {
    virtualCam.current.position.set(70, 80, 70);
    controlRef.current.target.set(0, 20, 0);
  };

  return (
    <>
      <Flex direction="row" width={600} justifyContent="center" alignItems="center" gap="size-100">
        <ActionButton type="button" onPress={reset} minWidth="100">
          Reset View
        </ActionButton>
      </Flex>
    </>
  );
};

export const Builder = () => {
  const controlRef = useRef();
  const virtualCam = useRef();

  const { orbitEnabled } = useApp();

  const { values, errors } = useFormState();

  const frames = values?.frames || [];
  const frameErrors = errors?.frames || [];

  return (
    <>
      <Control controlRef={controlRef} virtualCam={virtualCam} />

      <Canvas
      // camera={{
      //   fov: 75,
      //   aspect: window.innerWidth / window.innerHeight,
      //   near: 0.1,
      //   far: 10000,
      //   position: [70, 80, 70],
      //   zoom: 1.2,
      // }}
      >
        <PerspectiveCamera
          ref={virtualCam}
          makeDefault={true}
          fov={75}
          aspect={window.innerWidth / window.innerHeight}
          far={10000}
          near={0.1}
          position={[70, 80, 70]}
          zoom={1.2}
        />
        <OrbitControls enabled={orbitEnabled} ref={controlRef} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[-2, 5, 2]} intensity={1} />
        <Suspense fallback={null}>
          <group rotation={[Math.PI * -0.5, 0, 0]} position={[0, -40, 0]}>
            {/* {frames ? frames.map((v, i) => <Joint index={i} value={v} key={`joint-${i}`} />) : null} */}
            {frames ? (
              <Joint
                index={0}
                value={frames[0]}
                error={frameErrors[0]}
                frames={frames.slice(1, frames.length)}
                frameErrors={frameErrors.slice(1, frameErrors.length)}
              />
            ) : null}
          </group>
        </Suspense>
      </Canvas>
    </>
  );
};
