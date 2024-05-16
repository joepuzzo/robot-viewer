// import { useDrag } from '@use-gesture/react';
import { Cone, Cylinder, Line } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import { CylinderBufferGeometry, MeshStandardMaterial, DoubleSide } from 'three';

import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import Grid from './Grid';
import { toRadians } from '../../../lib/toRadians';
import { toDeg } from '../../../lib/toDeg';
import ArmContext from '../../context/ArmContext';
import { If } from '../Shared/If';
import { Joint } from './Joint';
import useGamepad from '../../hooks/useGamepad';
import useCamera from '../../hooks/useCamera';

function useDrag(onDrag, onStart, onEnd, toggle) {
  const active = React.useRef(false);
  // const [, toggle] = React.useContext(context);
  const [bind] = React.useState(() => ({
    onPointerDown: (event) => {
      event.stopPropagation();
      event.target.setPointerCapture(event.pointerId);
      active.current = true;
      // We don't want the camera to move while we're dragging, toggle it off
      toggle();
      if (onStart) onStart();
    },
    onPointerUp: (event) => {
      event.stopPropagation();
      event.target.releasePointerCapture(event.pointerId);
      active.current = false;
      // Drag has concluded, toggle the controls on again
      toggle();
      if (onEnd) onEnd();
    },
    onPointerMove: (event) => {
      if (active.current) {
        event.stopPropagation();
        onDrag(event.point);
      }
    },
  }));
  return bind;
}

// Hook
function useKeyPress({ targetKey, targetKeyCode }) {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState(false);
  // If pressed key is our target key then set to true
  function downHandler({ key, keyCode }) {
    if (key === targetKey || keyCode === targetKeyCode) {
      setKeyPressed(true);
    }
  }
  // If released key is our target key then set to false
  const upHandler = ({ key, keyCode }) => {
    if (key === targetKey || keyCode === targetKeyCode) {
      setKeyPressed(false);
    }
  };
  // Add event listeners
  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount
  return keyPressed;
}

const Pos = ({ name, args, grid, formApi, toggleOrbital, robotController, ...props }) => {
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  // Get Arm State
  const { animate, hideNegatives, showPlanes, showArrows } = useContext(ArmContext);

  // Get robot control
  const { updateRobot } = robotController;

  // For z control
  const spacePress = useKeyPress({ targetKeyCode: 32 });

  const ref = useRef();
  const [position, setPosition] = useState(() => {
    const { x, y, z, r1, r2, r3 } = formApi.getFormState().values;
    return [x, y, z, r1, r2, r3];
  });

  const { position: animatedPos } = useSpring({
    position: [position[0], position[1], position[2]],
    config: {
      clamp: true,
      tension: 70,
      // friction: 0,
    },
    immediate: !animate,
  });

  robotController.setBallRef.current = setPosition;

  const robotUpdate = (x, y, z, r1, r2, r3) => {
    // Update the robot
    updateRobot(x, y, z, r1, r2, r3);
  };

  useEffect(() => {
    robotUpdate(...position);
  }, [...position]);

  const handleKeyDown = useCallback(
    (event) => {
      const { key, keyCode } = event;

      const step = 1;

      if (key === 'ArrowUp') {
        setPosition(([x, y, z, r1, r2, r3]) => {
          if (spacePress) {
            return [x, y, z + step, r1, r2, r3];
          }
          return [x, y + step, z, r1, r2, r3];
        });
      } else if (key === 'ArrowDown') {
        setPosition(([x, y, z, r1, r2, r3]) => {
          if (spacePress) {
            return [x, y, z - step, r1, r2, r3];
          }
          return [x, y - step, z, r1, r2, r3];
        });
      } else if (key === 'ArrowLeft') {
        setPosition(([x, y, z, r1, r2, r3]) => {
          return [x - step, y, z, r1, r2, r3];
        });
      } else if (key === 'ArrowRight') {
        setPosition(([x, y, z, r1, r2, r3]) => {
          return [x + step, y, z, r1, r2, r3];
        });
      }

      switch (keyCode) {
        case 68: //d
          setPosition(([x, y, z, r1, r2, r3]) => {
            return spacePress ? [x, y, z, r1, r2, r3 + 1] : [x, y, z, r1, r2 + 1, r3];
          });
          break;
        case 83: //s
          setPosition(([x, y, z, r1, r2, r3]) => {
            return [x, y, z, r1 + 1, r2, r3];
          });
          break;
        case 65: //a
          setPosition(([x, y, z, r1, r2, r3]) => {
            return spacePress ? [x, y, z, r1, r2, r3 - 1] : [x, y, z, r1, r2 - 1, r3];
          });
          break;
        case 87: //w
          setPosition(([x, y, z, r1, r2, r3]) => {
            return [x, y, z, r1 - 1, r2, r3];
          });
          break;
      }

      // console.log('KEY', key, keyCode);
    },
    [spacePress],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    // document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // document.removeEventListener('keyup', handleKeyUp)
    };
  }, [spacePress]);

  // -------- Now add gamepad control -----------
  const { buttons, axes, gamepad, connected, setButtons, setAxes } = useGamepad();

  useEffect(() => {
    const interval = setInterval(() => {
      const gamepadData = navigator.getGamepads()[0];

      if (gamepadData) {
        setButtons(gamepadData.buttons);
        setAxes(gamepadData.axes);

        let plusX = 0;
        let plusY = 0;
        let plusZ = 0;

        // Only update if value is over 0.1
        if (Math.abs(gamepadData.axes[0]) > 0.1) {
          plusX = gamepadData.axes[0];
        }
        if (Math.abs(gamepadData.axes[1]) > 0.1) {
          plusY = -gamepadData.axes[1];
        }
        if (Math.abs(gamepadData.axes[3]) > 0.1) {
          plusZ = -gamepadData.axes[3];
        }

        if (Math.abs(plusX) + Math.abs(plusY) + Math.abs(plusZ) > 0) {
          setPosition(([x, y, z, r1, r2, r3]) => {
            // console.log('Update From Gamepad');
            return [x + plusX, y + plusY, z + plusZ, r1, r2, r3];
          });
        }
      }
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // console.log('RENDER POS');

  // ...bind
  return (
    <animated.group
      ref={ref}
      {...props}
      position={animatedPos}
      // position={[-position.x, position.y, position.z]}
      // position={[2, 2, 2]}
    >
      <mesh onPointerOver={(event) => setHover(true)} onPointerOut={(event) => setHover(false)}>
        <sphereBufferGeometry args={args} position={[0, 0, -1.5]} />
        <meshStandardMaterial color={hovered ? 'hotpink' : '#f9c74f'} opacity={0.4} transparent />
      </mesh>
      {grid ? (
        <Grid
          size={10}
          hideNegatives={true}
          hidePosatives={true}
          showPlanes={false}
          showArrows={false}
        />
      ) : null}
    </animated.group>
  );
};

const Tool = ({
  name,
  args,
  grid,
  formApi,
  toggleOrbital,
  position,
  rotation,
  actual,
  lineOffset1,
  lineOffset2,
  ...props
}) => {
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  const lineColor = 'pink';

  const ref = useRef();

  // Get Arm State
  const { hideNegatives, showPlanes, showArrows } = useContext(ArmContext);

  // ...bind()

  let cylinderArgs = [...args];
  // cylinderArgs[2] = cylinderArgs[2] / 2;

  return (
    <group ref={ref} {...props} position={position}>
      <mesh
        rotation={rotation}
        onPointerOver={(event) => setHover(true)}
        onPointerOut={(event) => setHover(false)}
        // position={[0, 0, -cylinderArgs[2] / 2]}
      >
        <cylinderGeometry args={cylinderArgs} />
        <meshStandardMaterial color={hovered ? 'hotpink' : '#f9c74f'} opacity={0.4} transparent />
      </mesh>
      {grid ? (
        <Grid size={10} hideNegatives={true} showPlanes={showPlanes} showArrows={showArrows} />
      ) : null}
      <Line
        rotation={rotation}
        points={[
          [0, actual / 2 + lineOffset1, 0],
          [0, -actual / 2 + lineOffset2, 0],
        ]}
        color={lineColor}
        lineWidth={1}
      />
    </group>
  );
};

const ErrorBall = () => {
  return (
    <mesh>
      <sphereBufferGeometry args={[10, 30, 30]} />
      <meshStandardMaterial color="#880808" opacity={0.4} transparent />
    </mesh>
  );
};

const Component = ({
  children,
  name,
  args,
  grid,
  actual,
  position,
  rotation,
  jointRotation: userJointRotation,
  doubleV,
  error,
  lineColor,
  lineOffset1: userLineOffset1,
  lineOffset2: userLineOffset2,
  xOffset,
  yOffset = 0,
  ...props
}) => {
  // Get Arm Context
  const {
    hide,
    hideNegatives,
    showPlanes,
    showArrows,
    showCylinder,
    linkColor,
    animate,
    updateMotion,
    runOnRobot,
    simulating,
  } = useContext(ArmContext);

  const { rotation: jointRotation } = useSpring({
    rotation: userJointRotation,
    config: {
      clamp: true,
      tension: 70,
      // friction: 0,
    },
    immediate: !animate,
    onStart: () => {
      if (animate && !runOnRobot && simulating?.play) updateMotion(name, 'move');
    },
    onRest: () => {
      if (animate && !runOnRobot && simulating?.play) updateMotion(name, 'stop');
    },
  });

  // This reference will give us direct access to the mesh
  const mesh = useRef();

  let joint = name[0] === 'j';
  let vertex = name[0] === 'v';

  let color = joint ? 'rgb(229, 149, 38)' : 'rgb(54, 54, 54)';

  if (error) {
    color = '#880808';
  }

  const lineOffset1 = userLineOffset1 ?? 1.25;
  const lineOffset2 = userLineOffset2 ?? 1.25;

  let opacity = 1;
  let transparent = true;
  if (hide) {
    opacity = 0.02;
  }

  const clydYLength = yOffset - 2.5;

  if (vertex) {
    return (
      <group ref={mesh} position={position} {...props}>
        <group rotation={rotation}>
          <mesh>
            <cylinderGeometry args={args} />
            <meshStandardMaterial color={color} opacity={opacity} transparent={transparent} />
          </mesh>
          {linkColor ? (
            <mesh>
              <cylinderGeometry args={[5.01, 5.01, 0.2, 32]} />
              <meshStandardMaterial color={lineColor} opacity={opacity} transparent={transparent} />
            </mesh>
          ) : null}
          {!doubleV ? (
            <mesh
              position={[xOffset ?? 0, args[2] / 2 + 5, -3.75 - yOffset]}
              rotation={[0, Math.PI / 2, Math.PI / 2]}
            >
              <cylinderGeometry args={[5, 5, 2.5, 32]} />
              <meshStandardMaterial color={color} opacity={opacity} transparent={transparent} />
            </mesh>
          ) : null}
          {doubleV ? (
            <>
              <mesh
                position={[0, -(args[2] / 2 + 5), 3.75 + yOffset / 2]}
                rotation={[0, Math.PI / 2, Math.PI / 2]}
              >
                <cylinderGeometry args={[5, 5, 2.5 + yOffset, 32]} />
                <meshStandardMaterial color={color} opacity={opacity} transparent={transparent} />
              </mesh>
              <mesh position={[0, args[2] / 2 + 5, 3.75]} rotation={[0, Math.PI / 2, Math.PI / 2]}>
                <cylinderGeometry args={[5, 5, 2.5, 32]} />
                <meshStandardMaterial color={color} opacity={opacity} transparent={transparent} />
              </mesh>
            </>
          ) : null}
        </group>
        {children}
        {grid ? (
          <Grid
            size={hide ? 10 : 30}
            hideNegatives={hideNegatives}
            showPlanes={showPlanes}
            showArrows={showArrows}
            showCylinder={showCylinder}
          />
        ) : null}
        {hide && actual ? (
          <>
            <Line
              rotation={rotation}
              points={[
                [0, actual / 2 + lineOffset1, 0],
                [0, -actual / 2 + lineOffset2, 0],
              ]}
              color={lineColor}
              lineWidth={1}
            />
          </>
        ) : null}
      </group>
    );
  } else {
    return (
      <animated.group ref={mesh} position={position} rotation={jointRotation} {...props}>
        <mesh rotation={rotation}>
          <cylinderGeometry args={args} />
          <meshStandardMaterial color={color} opacity={opacity} transparent={transparent} />
        </mesh>
        {children}
        {grid ? (
          <Grid
            size={hide ? 10 : 30}
            hideNegatives={hideNegatives}
            showPlanes={showPlanes}
            showArrows={showArrows}
            showCylinder={showCylinder}
          />
        ) : null}
        {error ? <ErrorBall /> : null}
        {hide && actual ? (
          <Line
            rotation={rotation}
            points={[
              [0, -actual / 2 + 0.25, 0],
              [0, actual / 2, 0],
            ]}
            color={lineColor}
            lineWidth={1}
          />
        ) : null}
      </animated.group>
    );
  }
};

const CameraThings = () => {
  const data = useCamera();

  if (!data) return null;

  return (
    <>
      {data.map((obj) => {
        const { x, y, z } = obj;

        const geometry = new CylinderBufferGeometry(8, 6, 20, 30, 1, true);
        const material = new MeshStandardMaterial({ color: 'rgb(188,49,44)', side: DoubleSide });

        return (
          <group position={[x, y, z]} rotation={[Math.PI / 2, 0, 0]}>
            {/* <Cone args={[5, 10, 30]}>
              <meshStandardMaterial color="hotpink" />
            </Cone> */}

            {/* <Cylinder args={[8, 6, 20, 30]}>
              <meshStandardMaterial color="rgb(188,49,44)" />
            </Cylinder> */}
            <mesh geometry={geometry} material={material} />
          </group>
        );
      })}
    </>
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

export function Arm({
  simulateController,
  simulateState,
  robotController,
  config,
  values,
  formApi,
  toggleOrbital,
  errors,
  frames = [],
}) {
  const {
    jointGrid,
    mainGrid,
    gridSize,
    hide,
    linkColor,
    animate,
    showPlanes,
    showArrows,
    hideNegatives,
    runOnRobot,
    showCylinder,
  } = values;

  const frameErrors = errors?.frames || [];

  const { updateMotion } = simulateController;
  const { simulating } = simulateState;

  // const jointGrid = false;
  const vertexGrid = false;

  const value = {
    jointGrid,
    vertexGrid,
    hide,
    hideNegatives,
    linkColor,
    animate,
    updateMotion,
    runOnRobot,
    simulating,
    showPlanes,
    showArrows,
    showCylinder,
  };

  return (
    <ArmContext.Provider value={value}>
      <group rotation={[Math.PI * -0.5, 0, 0]}>
        {mainGrid ? <Grid size={gridSize} showArrows shift /> : null}
        {/* <group position={[gridSize / 2 - 10, -gridSize / 2, 0]}>
          <Grid size={10} showArrows hideNegatives showPlanes={false} />
        </group> */}
        <If condition={frames && frames[0]}>
          <Joint
            index={0}
            value={frames[0]}
            error={frameErrors[0]}
            frames={frames.slice(1, frames.length)}
            frameErrors={frameErrors.slice(1, frameErrors.length)}
            values={values}
            base={values.base}
            config={config}
            updateMotion={updateMotion}
            simulating={simulating}
          />
        </If>
        <Pos
          name="pos"
          args={[3, 30, 30]}
          grid
          formApi={formApi}
          toggleOrbital={toggleOrbital}
          robotController={robotController}
        />
        <CameraThings />
      </group>
    </ArmContext.Provider>
  );
}
