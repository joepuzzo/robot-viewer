import { useFormState } from 'informed';
import { useThree, useFrame } from '@react-three/fiber';
// import { useDrag } from '@use-gesture/react';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Grid from './Grid';

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

const Pos = ({ name, setSelected, selected, args, grid, formApi, toggleOrbital, ...props }) => {
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  // For z control
  const spacePress = useKeyPress({ targetKeyCode: 32 });

  const ref = useRef();
  const [position, setPosition] = useState([2, 2, 0]);
  const { size, viewport } = useThree();

  const handleKeyDown = useCallback(
    (event) => {
      const { key, keyCode } = event;

      if (key === 'ArrowUp') {
        setPosition(([x, y, z]) => {
          if (spacePress) {
            return [x, y, z - 1];
          }
          return [x, y + 1, z];
        });
      } else if (key === 'ArrowDown') {
        setPosition(([x, y, z]) => {
          if (spacePress) {
            return [x, y, z + 1];
          }
          return [x, y - 1, z];
        });
      } else if (key === 'ArrowLeft') {
        setPosition(([x, y, z]) => {
          return [x - 1, y, z];
        });
      } else if (key === 'ArrowRight') {
        setPosition(([x, y, z]) => {
          return [x + 1, y, z];
        });
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
    <group ref={ref} {...props} position={position}>
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
  toggleOrbital,
  position,
  ...props
}) => {
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  const ref = useRef();

  // ...bind()
  return (
    <group ref={ref} {...props} position={position}>
      <mesh onPointerOver={(event) => setHover(true)} onPointerOut={(event) => setHover(false)}>
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
          <mesh position={[-0.75, args[2] / 2 + 1, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[1, 1, 0.5, 32]} />
            <meshStandardMaterial color={color} />
          </mesh>
          {doubleV ? (
            <mesh position={[-0.75, -(args[2] / 2 + 1), 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[1, 1, 0.5, 32]} />
              <meshStandardMaterial color={color} />
            </mesh>
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

export function Box({ values, formApi, RobotKin, toggleOrbital }) {
  const { base, v0, v1, v2, v3, v4, j0, j1, j2, j3, j4, j5, vertexGrid } = values;

  const [selected, setSelected] = useState();

  const jointGrid = true;

  return (
    <>
      {/* <Grid size={10} /> */}
      <Component
        name="base"
        setSelected={setSelected}
        selected={selected}
        position={[0, -base / 2 - 0.5, 0]}
        args={[1, 1.5, base, 32]}
        rotation={[0, 0, 0]}
      >
        <Component
          name="j0"
          setSelected={setSelected}
          selected={selected}
          args={[1, 1, 1, 32]}
          rotation={[0, 0, 0]}
          jointRotation={[0, j0, 0]}
          position={[0, base / 2 + 0.5, 0]}
          grid={jointGrid}
        >
          <Component
            name="v0"
            setSelected={setSelected}
            selected={selected}
            radius={0.1}
            args={[1, 1, v0, 32]}
            position={[0, v0 / 2 + 0.5, 0]}
            grid={vertexGrid}
          >
            <Component
              name="j1"
              jointRotation={[j1, 0, 0]}
              rotation={[0, 0, Math.PI / 2]}
              setSelected={setSelected}
              selected={selected}
              args={[1, 1, 1, 32]}
              position={[0, v0 / 2 + 1, 0]}
              grid={jointGrid}
            >
              <Component
                name="v1"
                setSelected={setSelected}
                selected={selected}
                rotation={[0, Math.PI, 0]}
                args={[1, 1, v1, 32]}
                position={[0, v1 / 2 + 1, 0]}
                doubleV
                grid={vertexGrid}
              >
                <Component
                  name="j2"
                  rotation={[0, 0, -Math.PI / 2]}
                  jointRotation={[j2, 0, 0]}
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
                    rotation={[Math.PI, 0, 0]}
                    args={[1, 1, v2, 32]}
                    position={[0, v2 / 2 + 1, 0]}
                    grid={vertexGrid}
                  >
                    <Component
                      name="j3"
                      jointRotation={[0, j3, 0]}
                      setSelected={setSelected}
                      selected={selected}
                      args={[1, 1, 1, 32]}
                      position={[0, v2 / 2 + 0.5, 0]}
                      grid={jointGrid}
                    >
                      <Component
                        name="v3"
                        setSelected={setSelected}
                        selected={selected}
                        rotation={[0, 0, 0]}
                        args={[1, 1, v3, 32]}
                        position={[0, v3 / 2 + 0.5, 0]}
                        grid={vertexGrid}
                      >
                        <Component
                          name="j4"
                          rotation={[0, 0, Math.PI / 2]}
                          jointRotation={[j4, 0, 0]}
                          setSelected={setSelected}
                          selected={selected}
                          args={[1, 1, 1, 32]}
                          position={[0, v3 / 2 + 1, 0]}
                          grid={jointGrid}
                        >
                          <Component
                            name="v4"
                            setSelected={setSelected}
                            selected={selected}
                            rotation={[0, 0, Math.PI]}
                            args={[1, 1, v4, 32]}
                            position={[0, v4 / 2 + 1, 0]}
                            grid={vertexGrid}
                          >
                            <Component
                              name="j5"
                              rotation={[0, 0, 0]}
                              jointRotation={[0, j5, 0]}
                              setSelected={setSelected}
                              selected={selected}
                              args={[1, 1, 1, 32]}
                              position={[0, v4 / 2 + 0.5, 0]}
                              grid={jointGrid}
                            >
                              <Tool
                                name="tool"
                                rotation={[0, j5, 0]}
                                setSelected={setSelected}
                                selected={selected}
                                args={[0.5, 0.5, 1, 32]}
                                position={[0, 1, 0]}
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
        rotation={[0, j5, 0]}
        setSelected={setSelected}
        selected={selected}
        args={[0.5, 30, 30]}
        position={[0, -1, 0]}
        grid
        formApi={formApi}
        toggleOrbital={toggleOrbital}
      />
    </>
  );
}
