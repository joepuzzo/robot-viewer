import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import { Line, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import Grid from '../../3D/Grid';
import { Canvas } from '@react-three/fiber';
import { ActionButton, Flex } from '@adobe/react-spectrum';
import useApp from '../../../hooks/useApp';
import { useFieldState, useFormApi, useFormState } from 'informed';
import { toRadians } from '../../../../lib/toRadians';
import { useSpring, animated } from '@react-spring/three';
import { If } from '../../Shared/If';
import { isParallel, isPerpendicular } from '../../../utils/frame';

const COLORS = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];

const ErrorBall = () => {
  return (
    <mesh>
      <sphereBufferGeometry args={[10, 30, 30]} />
      <meshStandardMaterial color="#880808" opacity={0.4} transparent />
    </mesh>
  );
};
/* ------------------------------ Joint ------------------------------ */
const Joint = ({
  index,
  value,
  error,
  frames,
  frameErrors,
  base,
  showArrows,
  showCylinder,
  showPlanes,
  jointGrid,
  showLinks,
  values,
}) => {
  const rot1 = value.r1;
  const rot2 = value.r2;
  const rot3 = value.r3;
  const { x, y, z, moveBack, moveBackBy, frameType } = value;
  const { hide, showLines } = values;

  const { value: type } = useFieldState(`eulerType`);

  const jRotation = values[`j${index}`] ? toRadians(values[`j${index}`]) : 0;

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
      r3[rotations[2]] = toRadians(rot3) + jRotation;
    }

    return [Object.values(r1), Object.values(r2), Object.values(r3)];
  }, [type, rot1, rot2, rot3, jRotation]);

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
    // immediate: !animate,
    // onStart: () => {
    //   if (animate && !runOnRobot && simulating?.play) updateMotion(name, 'move');
    // },
    // onRest: () => {
    //   if (animate && !runOnRobot && simulating?.play) updateMotion(name, 'stop');
    // },
  });

  const { linkPosition, linkRotation, moveBackPos, v, along } = useMemo(() => {
    const moveBackPos = [0, 0, 0];

    if (moveBack === 'x') moveBackPos[0] = moveBackPos[0] + moveBackBy;
    if (moveBack === '-x') moveBackPos[0] = moveBackPos[0] - moveBackBy;

    if (moveBack === 'y') moveBackPos[1] = moveBackPos[1] + moveBackBy;
    if (moveBack === '-y') moveBackPos[1] = moveBackPos[1] - moveBackBy;

    if (moveBack === 'z') moveBackPos[2] = moveBackPos[2] + moveBackBy;
    if (moveBack === '-z') moveBackPos[2] = moveBackPos[2] - moveBackBy;

    let linkRotation = [0, 0, 0];
    let linkPosition = [0, 0, 0];

    let v = null;
    let along = null;
    const n = frames[0];

    // If we have a next frame
    if (n) {
      // Get length to next frame and along what axis
      v = n.x;
      along = 'x';
      if (Math.abs(n.y) > Math.abs(v)) {
        v = n.y;
        along = 'y';
      }
      if (Math.abs(n.z) > Math.abs(v)) {
        v = n.z;
        along = 'z';
      }

      // link type () -- () OR [ ] -- [ ]
      if (isParallel(n.x, n.y, n.z, n.r1, n.r2, n.r3, 'z', 'z')) {
        if (along === 'y') {
          v = v < 0 ? v + 10 : v - 10;
          const offset = v < 0 ? -5 : 5;
          linkRotation = [0, 0, 0];
          linkPosition = [0, v / 2 + offset, 0];
        }
        if (along === 'x') {
          v = v < 0 ? v + 10 : v - 10;
          const offset = v < 0 ? -5 : 5;
          linkRotation = [0, 0, Math.PI / 2];
          linkPosition = [v / 2 + offset, 0, 0];
        }
        // link type [ ] -- [ ]
        if (along === 'z') {
          v = v < 0 ? v + 5 : v - 5;
          const offset = v < 0 ? -2.5 : 2.5;
          linkRotation = [Math.PI / 2, 0, 0];
          linkPosition = [0, 0, v / 2 + offset];
        }
      }
      // link type [ ] -- ( ) OR ( ) -- [ ]
      else {
        v = v < 0 ? v + 7.5 : v - 7.5;
        if (along === 'x') {
          const offset = v < 0 ? -5 : 5;
          linkRotation = [0, 0, Math.PI / 2];
          linkPosition = [v / 2 + offset, 0, 0];
        }
        if (along === 'y') {
          const offset = v < 0 ? -5 : 5;
          linkRotation = [0, 0, 0];
          linkPosition = [0, v / 2 + offset, 0];
        }
        if (along === 'z') {
          const offset = v < 0 ? -2.5 : 2.5;
          linkRotation = [Math.PI / 2, 0, 0];
          linkPosition = [0, 0, v / 2 + offset];
        }
      }

      // We are the second to last frame
      // if (!frames[1]) {
      //   v = v - 5;
      // }
    }

    return { moveBackPos, linkRotation, linkPosition, v, along };
  }, [
    frames[0]?.z,
    frames[0]?.y,
    frames[0]?.x,
    frames[0]?.frameType,
    moveBack,
    moveBackBy,
    frames[0]?.r1,
    frames[0]?.r2,
    frames[0]?.r3,
  ]);

  // console.log('HERE', index, v, along, linkPosition);

  // const linkWidth = hide ? 1 : 5;

  return (
    <group position={[x, y, z + (base ?? 0)]}>
      <If condition={base}>
        <Grid size={40} hideNegatives hidePosatives showArrows showPlanes={false} transparent />
      </If>
      <If condition={moveBack && showArrows}>
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
      </If>
      <animated.group rotation={rotation1}>
        <animated.group rotation={rotation2}>
          <animated.group rotation={rotation3}>
            <Grid
              size={20}
              hideNegatives
              lineWidth={5}
              axisLabel={index}
              showPlanes={showPlanes}
              showArrows={showArrows}
              hidePosatives={!showArrows}
              showCylinder={frameType == 'rotary' && showCylinder}
              showJoint={showLinks}
              base={base}
              transparentJoint={hide}
            />
            <If condition={frames[0] && v && showLinks}>
              <mesh rotation={linkRotation} position={linkPosition}>
                <cylinderGeometry args={[5, 5, v, 32]} />
                <meshStandardMaterial
                  color="rgb(54, 54, 54)"
                  opacity={hide ? 0.02 : 1}
                  transparent
                />
              </mesh>
            </If>
            <If condition={frames[0] && v && showLines}>
              <Line
                // rotation={linkRotation}
                points={[
                  [0, 0, 0],
                  [frames[0]?.x, frames[0]?.y, frames[0]?.z],
                ]}
                color={COLORS[index % COLORS.length]}
                lineWidth={2}
              />
            </If>
            <If condition={frames.length}>
              <Joint
                index={index + 1}
                value={frames[0]}
                error={frameErrors[0]}
                frames={frames.slice(1, frames.length)}
                frameErrors={frameErrors.slice(1, frameErrors.length)}
                showPlanes={showPlanes}
                showArrows={showArrows}
                showCylinder={showCylinder}
                jointGrid={jointGrid}
                showLinks={showLinks}
                values={values}
              />
            </If>
            <If condition={error}>
              <ErrorBall />
            </If>
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
        <ActionButton type="button" onPress={reset} minWidth="100px">
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
  const formApi = useFormApi();

  const frames = values?.frames || [];
  const frameErrors = errors?.frames || [];

  const position = [values?.cameraX, values?.cameraY, values?.cameraZ];
  const cameraZoom = values?.cameraZoom;

  const { showPlanes, showArrows, showCylinder, jointGrid, showLinks, mainGrid, gridSize, base } =
    values;

  // This will zoom out and re pos the camera view when we add frames
  useEffect(() => {
    if (frames && controlRef.current) {
      // Set new camera target
      controlRef.current.target.set(0, frames.length * 15, 0);
      // Zoom out
      formApi.setValue('cameraZoom', 6 / frames.length);
    }
  }, [frames, frames?.length]);

  return (
    <>
      {/* <Control controlRef={controlRef} virtualCam={virtualCam} /> */}
      <Canvas>
        <PerspectiveCamera
          ref={virtualCam}
          makeDefault={true}
          fov={75}
          aspect={window.innerWidth / window.innerHeight}
          far={10000}
          near={0.5}
          position={position}
          zoom={cameraZoom}
        />
        <OrbitControls
          enabled={orbitEnabled}
          ref={controlRef}
          target={[5, frames.length * 10, 0]}
        />
        <ambientLight intensity={0.5} />
        <directionalLight position={[-2, 5, 2]} intensity={1} />
        <Suspense fallback={null}>
          <group rotation={[Math.PI * -0.5, 0, 0]} position={[0, 0, 0]}>
            {mainGrid ? <Grid size={gridSize} showArrows shift /> : null}
            {/* {frames ? frames.map((v, i) => <Joint index={i} value={v} key={`joint-${i}`} />) : null} */}
            {frames ? (
              <Joint
                index={0}
                value={frames[0]}
                error={frameErrors[0]}
                frames={frames.slice(1, frames.length)}
                frameErrors={frameErrors.slice(1, frameErrors.length)}
                base={base}
                showPlanes={showPlanes}
                showArrows={showArrows}
                showCylinder={showCylinder}
                jointGrid={jointGrid}
                showLinks={showLinks}
                values={values}
              />
            ) : null}
          </group>
        </Suspense>
      </Canvas>
    </>
  );
};
