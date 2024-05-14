import React, { useMemo } from 'react';
import { useFieldState } from 'informed';
import { toRadians } from '../../../lib/toRadians';
import Grid from '../3D/Grid';
import { useSpring, animated } from '@react-spring/three';
import { If } from '../Shared/If';
import { isParallel } from '../../utils/frame';
import { Line } from '@react-three/drei';
import { toDeg } from '../../../lib/toDeg';
import { Vector3, Quaternion } from 'three';

const COLORS = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];

const ErrorBall = () => {
  return (
    <mesh>
      <sphereBufferGeometry args={[10, 30, 30]} />
      <meshStandardMaterial color="#880808" opacity={0.4} transparent />
    </mesh>
  );
};

const LineToCylinder = ({ start, end, color, opacity }) => {
  // Calculate the midpoint
  const midpoint = new Vector3().addVectors(start, end).multiplyScalar(0.5);

  // Calculate the length
  const length = start.distanceTo(end);

  // Calculate the rotation to align the cylinder with the line
  const direction = new Vector3().subVectors(end, start).normalize();
  const up = new Vector3(0, 1, 0);
  const quaternion = new Quaternion().setFromUnitVectors(up, direction);

  return (
    <mesh position={midpoint} quaternion={quaternion}>
      <cylinderGeometry args={[4.9, 4.9, length, 32]} />
      <meshStandardMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
};

/**
 *
 * @param {*} a angle in radians
 * @param {*} [l, h] low and high
 * @returns if its outside the bounds
 */
const outside = (a, [l, h]) => {
  const deg = toDeg(a);
  return deg < l || deg > h;
};

/* ------------------------------ Joint ------------------------------ */
export const Joint = ({
  index,
  value,
  error,
  frames,
  frameErrors,
  values,
  base,
  hidePadding,
  config = {},
  updateMotion,
  simulating,
}) => {
  const rot1 = value.r1;
  const rot2 = value.r2;
  const rot3 = value.r3;
  const { x, y, z, moveBack, moveBackBy, frameType } = value;
  const {
    hide,
    showLines,
    showPlanes,
    showArrows,
    showCylinder,
    jointGrid,
    showLinks,
    endEffector,
    animate,
    runOnRobot,
    showConnections,
  } = values;

  let { value: type } = useFieldState(`eulerType`);
  type = type ?? 'xyz';

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
    immediate: !animate,
    onStart: () => {
      if (animate && !runOnRobot && simulating?.play && updateMotion)
        updateMotion(`j${index}`, 'move');
    },
    onRest: () => {
      if (animate && !runOnRobot && simulating?.play && updateMotion)
        updateMotion(`j${index}`, 'stop');
    },
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
          if (!frames[1]) v = v + 2.5; // We are the second to last frame
          linkRotation = [0, 0, 0];
          linkPosition = [0, v / 2 + offset, 0];
        }
        if (along === 'x') {
          v = v < 0 ? v + 10 : v - 10;
          if (!frames[1]) v = v + 2.5; // We are the second to last frame
          const offset = v < 0 ? -5 : 5;
          linkRotation = [0, 0, Math.PI / 2];
          linkPosition = [v / 2 + offset, 0, 0];
        }
        // link type [ ] -- [ ]
        if (along === 'z') {
          v = v < 0 ? v + 5 : v - 5;
          if (!frames[1]) v = v + 2.5; // We are the second to last frame
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

  const lastFrame = !frames[0];

  const rangeError = config[`rangej${index}`] && outside(jRotation, config[`rangej${index}`]);

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
              hidePadding={hidePadding}
            />
            <If condition={frames[0] && v && showLinks}>
              <LineToCylinder
                start={new Vector3(0, 0, 0)}
                end={new Vector3(frames[0]?.x, frames[0]?.y, frames[0]?.z)}
                color="rgb(54, 54, 54)"
                opacity={hide ? 0.02 : 1}
              />
            </If>
            <If condition={frames[0] && v && showLines}>
              <Line
                points={[
                  [0, 0, 0],
                  [frames[0]?.x, frames[0]?.y, frames[0]?.z],
                ]}
                color={COLORS[index % COLORS.length]}
                lineWidth={2}
              />
            </If>
            <If condition={frames[0] && v && showConnections}>
              <Line
                points={[
                  [0, 0, 0],
                  [frames[0]?.x, frames[0]?.y, frames[0]?.z],
                ]}
                color={COLORS[index % COLORS.length]}
                lineWidth={20}
              />
            </If>
            <If condition={endEffector && lastFrame}>
              <Line
                points={[
                  [0, 0, 0],
                  [0, 0, endEffector],
                ]}
                color="rgb(204, 44, 117)"
                lineWidth={3}
              />
              <group position={[0, 0, endEffector]}>
                <Grid size={10} hideNegatives showArrows showPlanes={false} lineWidth={4} />
              </group>
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
                config={config}
                updateMotion={updateMotion}
                simulating={simulating}
                hidePadding={
                  frames[0] &&
                  Math.max(Math.abs(frames[0].x), Math.abs(frames[0].y), Math.abs(frames[0].z)) < 5
                }
              />
            </If>
            <If condition={error || rangeError}>
              <ErrorBall />
            </If>
          </animated.group>
        </animated.group>
      </animated.group>
    </group>
  );
};
