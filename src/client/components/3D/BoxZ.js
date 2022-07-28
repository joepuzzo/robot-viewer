import { useFormState } from 'informed';
import { useThree, useFrame } from '@react-three/fiber';
// import { useDrag } from '@use-gesture/react';

import { inverse } from '../../../lib/inverse';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Grid from './Grid';
import { toRadians } from '../../../lib/toRadians';
import { toDeg } from '../../../lib/toDeg';

// export const Box = ({ config }) => {
//   const { x, y, z } = config;

//   return (
//     <mesh rotation={[90, 0, 20]}>
//       <boxBufferGeometry attach="geometry" args={[x, y, z]} />
//       <meshStandardMaterial attach="material" color="rgba(177,141,32)" />
//     </mesh>
//   );
// };

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
  RobotKin,
  toggleOrbital,
  control,
  ...props
}) => {
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  // For z control
  const spacePress = useKeyPress({ targetKeyCode: 32 });

  const ref = useRef();
  const [position, setPosition] = useState(() => {
    const { x, y, z, r1, r2, r3 } = formApi.getFormState().values;
    return [x, y, z, r1, r2, r3];
  });

  control.setBall.current = setPosition;

  const updateRobot = (x, y, z, r1, r2, r3) => {
    const pos = [x, y, z, r1, r2, r3];

    const { base, v0, v1, v2, v3, v4, v5 } = formApi.getFormState().values;

    // We give in degrees so turn into rads
    const ro1 = toRadians(r1);
    const ro2 = toRadians(r2);
    const ro3 = toRadians(r3);

    console.log('Updating robot to', pos);
    console.log('Getting angles for', pos);
    const angles = inverse(x, y, z, ro1, ro2, ro3, {
      a1: base + 0.5 + v0 + 1.5, // 2.5
      a2: v1 + 2, // 3
      a3: v2 + 1.5, // 2.5
      a4: v3 + 1.5, // 2.5
      a5: v4 + 1, // 2.5
      a6: v5 + 1.5, // 2
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
        x,
        y,
        z,
        r1,
        r2,
        r3,
      });
    }
  };

  useEffect(() => {
    updateRobot(...position);
  }, [...position]);

  const handleKeyDown = useCallback(
    (event) => {
      const { key, keyCode } = event;

      const step = 0.1;

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
    <group
      ref={ref}
      {...props}
      position={[position[0], position[1], position[2]]}
      // position={[-position.x, position.y, position.z]}
      // position={[2, 2, 2]}
    >
      <mesh onPointerOver={(event) => setHover(true)} onPointerOut={(event) => setHover(false)}>
        <sphereBufferGeometry args={args} />
        <meshStandardMaterial color={hovered ? 'hotpink' : '#f9c74f'} opacity={0.4} transparent />
      </mesh>
      {grid ? <Grid size={1} /> : null}
    </group>
  );
};

const Tool = ({
  name,
  setSelected,
  selected,
  args,
  grid,
  formApi,
  RobotKin,
  toggleOrbital,
  position,
  rotation,
  ...props
}) => {
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  const ref = useRef();

  // ...bind()
  return (
    <group ref={ref} {...props} position={position}>
      <mesh
        rotation={rotation}
        onPointerOver={(event) => setHover(true)}
        onPointerOut={(event) => setHover(false)}
      >
        <cylinderGeometry args={args} />
        <meshStandardMaterial color={hovered ? 'hotpink' : '#f9c74f'} opacity={0.4} transparent />
      </mesh>
      {grid ? <Grid size={1} /> : null}
    </group>
  );
};

const Component = ({
  children,
  name,
  setSelected,
  selected,
  args,
  grid,
  position,
  rotation,
  jointRotation,
  doubleV,
  ...props
}) => {
  // This reference will give us direct access to the mesh
  const mesh = useRef();

  let joint = name[0] === 'j';
  let vertex = name[0] === 'v';

  let color = joint ? 'rgb(229, 149, 38)' : 'rgb(54, 54, 54)';

  // if (selected === name) {
  //   color = 'rgb(15, 67, 142)';
  // } else if (hovered) {
  //   color = 'rgb(99, 99, 97)';
  // }

  if (vertex) {
    return (
      <group ref={mesh} position={position} {...props}>
        <group rotation={rotation}>
          <mesh>
            <cylinderGeometry args={args} />
            <meshStandardMaterial color={color} />
          </mesh>
          {!doubleV ? (
            <mesh position={[0, args[2] / 2 + 1, -0.75]} rotation={[0, Math.PI / 2, Math.PI / 2]}>
              <cylinderGeometry args={[1, 1, 0.5, 32]} />
              <meshStandardMaterial color={color} />
            </mesh>
          ) : null}
          {doubleV ? (
            <>
              <mesh
                position={[0, -(args[2] / 2 + 1), 0.75]}
                rotation={[0, Math.PI / 2, Math.PI / 2]}
              >
                <cylinderGeometry args={[1, 1, 0.5, 32]} />
                <meshStandardMaterial color={color} />
              </mesh>
              <mesh position={[0, args[2] / 2 + 1, 0.75]} rotation={[0, Math.PI / 2, Math.PI / 2]}>
                <cylinderGeometry args={[1, 1, 0.5, 32]} />
                <meshStandardMaterial color={color} />
              </mesh>
            </>
          ) : null}
        </group>
        {children}
        {grid ? <Grid size={3} /> : null}
      </group>
    );
  } else {
    return (
      <group ref={mesh} position={position} rotation={jointRotation} {...props}>
        <mesh rotation={rotation}>
          <cylinderGeometry args={args} />
          <meshStandardMaterial color={color} />
        </mesh>
        {children}
        {grid ? <Grid size={3} /> : null}
      </group>
    );
  }
};

export function BoxZ({ control, values, formApi, RobotKin, toggleOrbital }) {
  const { base, v0, v1, v2, v3, v4, jointGrid, mainGrid, gridSize } = values;

  const j0 = toRadians(values.j0);
  const j1 = toRadians(values.j1);
  const j2 = toRadians(values.j2);
  const j3 = toRadians(values.j3);
  const j4 = toRadians(values.j4);
  const j5 = toRadians(values.j5);

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
        args={[1, 1.5, base, 32]}
        rotation={[Math.PI * 0.5, 0, 0]}
        // grid
      >
        <Component
          name="j0"
          setSelected={setSelected}
          selected={selected}
          args={[1, 1, 1, 32]}
          rotation={[Math.PI * 0.5, 0, 0]}
          jointRotation={[0, 0, j0]}
          position={[0, 0, base / 2 + 0.5]}
          grid={jointGrid}
        >
          <Component
            name="v0"
            setSelected={setSelected}
            selected={selected}
            radius={0.1}
            args={[1, 1, v0, 32]}
            position={[0, 0, v0 / 2 + 0.5]}
            rotation={[Math.PI * 0.5, 0, 0]}
            grid={vertexGrid}
          >
            <Component
              name="j1"
              jointRotation={[Math.PI * 0.5, 0, j1]}
              rotation={[Math.PI * -0.5, 0, 0]}
              setSelected={setSelected}
              selected={selected}
              args={[1, 1, 1, 32]}
              position={[0, 0, v0 / 2 + 1]}
              grid={jointGrid}
            >
              <Component
                name="v1"
                setSelected={setSelected}
                selected={selected}
                rotation={[0, 0, 0]}
                args={[1, 1, v1, 32]}
                position={[0, v1 / 2 + 1, 0]}
                doubleV
                grid={vertexGrid}
              >
                <Component
                  name="j2"
                  rotation={[-Math.PI / 2, 0, 0]}
                  jointRotation={[0, 0, j2 + Math.PI * 0.5]}
                  setSelected={setSelected}
                  selected={selected}
                  args={[1, 1, 1, 32]}
                  position={[0, v1 / 2 + 1, 0]}
                  grid={jointGrid}
                >
                  <Component
                    name="v2"
                    setSelected={setSelected}
                    selected={selected}
                    rotation={[0, 0, Math.PI * 0.5]}
                    args={[1, 1, v2, 32]}
                    position={[v2 / 2 + 1, 0, 0]}
                    grid={vertexGrid}
                  >
                    <Component
                      name="j3"
                      jointRotation={[-Math.PI * 0.5, Math.PI * 0.5, j3]}
                      rotation={[Math.PI * 0.5, 0, 0]}
                      setSelected={setSelected}
                      selected={selected}
                      args={[1, 1, 1, 32]}
                      position={[v2 / 2 + 0.5, 0, 0]}
                      grid={jointGrid}
                    >
                      <Component
                        name="v3"
                        setSelected={setSelected}
                        selected={selected}
                        rotation={[Math.PI * 0.5, 0, 0]}
                        args={[1, 1, v3, 32]}
                        position={[0, 0, v3 / 2 + 0.5]}
                        grid={vertexGrid}
                      >
                        <Component
                          name="j4"
                          rotation={[Math.PI * 0.5, 0, 0]}
                          jointRotation={[Math.PI * 0.5, 0, j4]}
                          setSelected={setSelected}
                          selected={selected}
                          args={[1, 1, 1, 32]}
                          position={[0, 0, v3 / 2 + 1]}
                          grid={jointGrid}
                        >
                          <Component
                            name="v4"
                            setSelected={setSelected}
                            selected={selected}
                            rotation={[Math.PI, 0, 0]}
                            args={[1, 1, v4, 32]}
                            position={[0, v4 / 2 + 1, 0]}
                            grid={vertexGrid}
                          >
                            <Component
                              name="j5"
                              rotation={[Math.PI * 0.5, 0, 0]}
                              jointRotation={[-Math.PI * 0.5, 0, j5]}
                              setSelected={setSelected}
                              selected={selected}
                              args={[1, 1, 1, 32]}
                              position={[0, v4 / 2 + 0.5, 0]}
                              // grid={jointGrid}
                            >
                              <Tool
                                name="tool"
                                rotation={[Math.PI * 0.5, 0, 0]}
                                setSelected={setSelected}
                                selected={selected}
                                args={[0.5, 0.5, 1, 32]}
                                position={[0, 0, 1]}
                                grid
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
        args={[0.5, 30, 30]}
        grid
        control={control}
        formApi={formApi}
        RobotKin={RobotKin}
        toggleOrbital={toggleOrbital}
      />
    </group>
  );
}
