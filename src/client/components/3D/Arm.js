// import { useDrag } from '@use-gesture/react';
import { Line } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';

import { inverse } from '../../../lib/inverse';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Grid from './Grid';
import { toRadians } from '../../../lib/toRadians';
import { toDeg } from '../../../lib/toDeg';

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

const Pos = ({
  name,
  setSelected,
  selected,
  args,
  grid,
  formApi,
  toggleOrbital,
  animate,
  robotController,
  ...props
}) => {
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

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

  // control.setBall.current = setPosition;

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
    [spacePress]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    // document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // document.removeEventListener('keyup', handleKeyUp)
    };
  }, [spacePress]);

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
        <sphereBufferGeometry args={args} />
        <meshStandardMaterial color={hovered ? 'hotpink' : '#f9c74f'} opacity={0.4} transparent />
      </mesh>
      {grid ? <Grid size={10} /> : null}
    </animated.group>
  );
};

const Tool = ({
  name,
  setSelected,
  selected,
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

  // ...bind()

  let cylinderArgs = [...args];
  cylinderArgs[2] = cylinderArgs[2] / 2;

  return (
    <group ref={ref} {...props} position={position}>
      <mesh
        rotation={rotation}
        onPointerOver={(event) => setHover(true)}
        onPointerOut={(event) => setHover(false)}
      >
        <cylinderGeometry args={cylinderArgs} />
        <meshStandardMaterial color={hovered ? 'hotpink' : '#f9c74f'} opacity={0.4} transparent />
      </mesh>
      {grid ? <Grid size={10} /> : null}
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
  setSelected,
  selected,
  args,
  grid,
  actual,
  position,
  rotation,
  jointRotation: userJointRotation,
  doubleV,
  error,
  hide,
  hideNegatives,
  lineColor,
  lineOffset1: userLineOffset1,
  lineOffset2: userLineOffset2,
  linkColor,
  animate,
  updateMotion,
  xOffset,
  ...props
}) => {
  const { rotation: jointRotation } = useSpring({
    rotation: userJointRotation,
    config: {
      clamp: true,
      tension: 70,
      // friction: 0,
    },
    immediate: !animate,
    onStart: () => {
      if (animate) updateMotion(name, 'move');
    },
    onRest: () => {
      if (animate) updateMotion(name, 'stop');
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

  const lineOffset1 = userLineOffset1 ?? 2.5;
  const lineOffset2 = userLineOffset2 ?? 2.5;

  let opacity = 1;
  let transparent = true;
  if (hide) {
    opacity = 0.02;
  }

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
              <cylinderGeometry args={[10.01, 10.01, 0.2, 32]} />
              <meshStandardMaterial color={lineColor} opacity={opacity} transparent={transparent} />
            </mesh>
          ) : null}
          {!doubleV ? (
            <mesh
              position={[xOffset ?? 0, args[2] / 2 + 10, -7.5]}
              rotation={[0, Math.PI / 2, Math.PI / 2]}
            >
              <cylinderGeometry args={[10, 10, 5, 32]} />
              <meshStandardMaterial color={color} opacity={opacity} transparent={transparent} />
            </mesh>
          ) : null}
          {doubleV ? (
            <>
              <mesh
                position={[0, -(args[2] / 2 + 10), 7.5]}
                rotation={[0, Math.PI / 2, Math.PI / 2]}
              >
                <cylinderGeometry args={[10, 10, 5, 32]} />
                <meshStandardMaterial color={color} opacity={opacity} transparent={transparent} />
              </mesh>
              <mesh position={[0, args[2] / 2 + 10, 7.5]} rotation={[0, Math.PI / 2, Math.PI / 2]}>
                <cylinderGeometry args={[10, 10, 5, 32]} />
                <meshStandardMaterial color={color} opacity={opacity} transparent={transparent} />
              </mesh>
            </>
          ) : null}
        </group>
        {children}
        {grid ? <Grid size={hide ? 10 : 30} hideNegatives={hideNegatives} /> : null}
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
        {grid ? <Grid size={hide ? 10 : 30} hideNegatives={hideNegatives} /> : null}
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
  robotController,
  config,
  values,
  formApi,
  toggleOrbital,
}) {
  const { jointGrid, mainGrid, gridSize, hide, linkColor, animate, hideNegatives } = values;

  const { updateMotion } = simulateController;

  const j0 = toRadians(values.j0);
  const j1 = toRadians(values.j1);
  const j2 = toRadians(values.j2);
  const j3 = toRadians(values.j3);
  const j4 = toRadians(values.j4);
  const j5 = toRadians(values.j5);

  // Take off extras
  const base = values.base - 5;
  const x0 = values.x0;
  const v0 = values.v0 - 15;
  const v1 = values.v1 - 20;
  const v2 = values.v2 - 15;
  const v3 = values.v3 - 15;
  const v4 = values.v4 - 15;
  const v5 = values.v5;

  const [selected, setSelected] = useState();

  // const jointGrid = false;
  const vertexGrid = false;

  return (
    <group rotation={[Math.PI * -0.5, 0, 0]}>
      {mainGrid ? <Grid size={gridSize} /> : null}
      <Component
        name="base"
        setSelected={setSelected}
        selected={selected}
        position={[0, 0, base / 2]}
        args={[10, 15, base, 32]}
        rotation={[Math.PI * 0.5, 0, 0]}
        actual={values.base}
        hide={hide}
        hideNegatives={hideNegatives}
        animate={animate}
        // grid
      >
        <Component
          name="j0"
          setSelected={setSelected}
          selected={selected}
          args={[10, 10, 10, 32]}
          error={outside(j0, config.rangej0)}
          rotation={[Math.PI * 0.5, 0, 0]}
          jointRotation={[0, 0, j0]}
          position={[0, 0, base / 2 + 5]}
          grid={jointGrid}
          hide={hide}
          hideNegatives={hideNegatives}
          animate={animate}
          updateMotion={updateMotion}
        >
          <Component
            name="v0"
            setSelected={setSelected}
            selected={selected}
            radius={0.1}
            actual={values.v0}
            args={[10, 10, v0, 32]}
            position={[0, 0, v0 / 2 + 5]}
            rotation={[Math.PI * 0.5, 0, 0]}
            grid={vertexGrid}
            hide={hide}
            hideNegatives={hideNegatives}
            lineColor="red"
            lineOffset2={0}
            linkColor={linkColor}
            animate={animate}
            xOffset={x0}
          >
            <Component
              name="j1"
              jointRotation={[Math.PI * 0.5, 0, j1]}
              rotation={[Math.PI * -0.5, 0, 0]}
              setSelected={setSelected}
              selected={selected}
              args={[10, 10, 10, 32]}
              position={[x0, 0, v0 / 2 + 10]}
              grid={jointGrid}
              error={outside(j1, config.rangej1)}
              hide={hide}
              hideNegatives={hideNegatives}
              animate={animate}
              updateMotion={updateMotion}
            >
              <Component
                name="v1"
                setSelected={setSelected}
                selected={selected}
                rotation={[0, 0, 0]}
                args={[10, 10, v1, 32]}
                position={[0, v1 / 2 + 10, 0]}
                doubleV
                grid={vertexGrid}
                actual={values.v1}
                hide={hide}
                hideNegatives={hideNegatives}
                lineColor="green"
                lineOffset1={0}
                lineOffset2={0}
                linkColor={linkColor}
                animate={animate}
              >
                <Component
                  name="j2"
                  rotation={[-Math.PI / 2, 0, 0]}
                  jointRotation={[0, 0, j2 + Math.PI * 0.5]}
                  setSelected={setSelected}
                  selected={selected}
                  args={[10, 10, 10, 32]}
                  position={[0, v1 / 2 + 10, 0]}
                  grid={jointGrid}
                  error={outside(j2, config.rangej2)}
                  hide={hide}
                  hideNegatives={hideNegatives}
                  animate={animate}
                  updateMotion={updateMotion}
                >
                  <Component
                    name="v2"
                    setSelected={setSelected}
                    selected={selected}
                    rotation={[0, 0, Math.PI * 0.5]}
                    args={[10, 10, v2, 32]}
                    position={[v2 / 2 + 10, 0, 0]}
                    grid={vertexGrid}
                    actual={values.v2}
                    hide={hide}
                    hideNegatives={hideNegatives}
                    lineColor="blue"
                    linkColor={linkColor}
                    animate={animate}
                  >
                    <Component
                      name="j3"
                      jointRotation={[-Math.PI * 0.5, Math.PI * 0.5, j3]}
                      rotation={[Math.PI * 0.5, 0, 0]}
                      setSelected={setSelected}
                      selected={selected}
                      args={[10, 10, 10, 32]}
                      position={[v2 / 2 + 5, 0, 0]}
                      grid={jointGrid}
                      error={outside(j3, config.rangej3)}
                      hide={hide}
                      hideNegatives={hideNegatives}
                      animate={animate}
                      updateMotion={updateMotion}
                    >
                      <Component
                        name="v3"
                        setSelected={setSelected}
                        selected={selected}
                        rotation={[Math.PI * 0.5, 0, 0]}
                        args={[10, 10, v3, 32]}
                        position={[0, 0, v3 / 2 + 5]}
                        grid={vertexGrid}
                        actual={values.v3}
                        hide={hide}
                        hideNegatives={hideNegatives}
                        lineColor="orange"
                        linkColor={linkColor}
                        animate={animate}
                      >
                        <Component
                          name="j4"
                          rotation={[Math.PI * 0.5, 0, 0]}
                          jointRotation={[Math.PI * 0.5, 0, j4]}
                          setSelected={setSelected}
                          selected={selected}
                          args={[10, 10, 10, 32]}
                          position={[0, 0, v3 / 2 + 10]}
                          grid={jointGrid}
                          error={outside(j4, config.rangej4)}
                          hide={hide}
                          hideNegatives={hideNegatives}
                          animate={animate}
                          updateMotion={updateMotion}
                        >
                          <Component
                            name="v4"
                            setSelected={setSelected}
                            selected={selected}
                            rotation={[Math.PI, 0, 0]}
                            args={[10, 10, v4, 32]}
                            position={[0, v4 / 2 + 10, 0]}
                            grid={vertexGrid}
                            actual={values.v4}
                            hide={hide}
                            hideNegatives={hideNegatives}
                            lineColor="purple"
                            linkColor={linkColor}
                            animate={animate}
                          >
                            <Component
                              name="j5"
                              rotation={[Math.PI * 0.5, 0, 0]}
                              jointRotation={[-Math.PI * 0.5, 0, j5]}
                              setSelected={setSelected}
                              selected={selected}
                              args={[10, 10, 10, 32]}
                              position={[0, v4 / 2 + 5, 0]}
                              error={outside(j5, config.rangej5)}
                              hide={hide}
                              hideNegatives={hideNegatives}
                              grid={jointGrid}
                              animate={animate}
                              updateMotion={updateMotion}
                            >
                              <Tool
                                name="tool"
                                rotation={[Math.PI * 0.5, 0, 0]}
                                setSelected={setSelected}
                                selected={selected}
                                args={[5, 5, v5, 32]}
                                position={[0, 0, 10]}
                                grid
                                actual={values.v5}
                                lineOffset1={0}
                                lineOffset2={0}
                              />
                            </Component>
                          </Component>
                        </Component>
                      </Component>
                    </Component>
                  </Component>
                </Component>
              </Component>
            </Component>
          </Component>
        </Component>
      </Component>
      <Pos
        name="pos"
        setSelected={setSelected}
        selected={selected}
        args={[5, 30, 30]}
        grid
        animate={animate}
        formApi={formApi}
        toggleOrbital={toggleOrbital}
        robotController={robotController}
      />
    </group>
  );
}
