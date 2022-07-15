import { useFormState } from 'informed';
import React, { useRef, useState } from 'react';
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

const Component = ({
  children,
  name,
  setSelected,
  selected,
  args,
  grid,
  position,
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
        {children}
        {grid ? <Grid /> : null}
      </group>
    );
  } else {
    return (
      <group ref={mesh} position={position} {...props}>
        <mesh>
          <cylinderGeometry args={args} />
          <meshStandardMaterial color={color} />
        </mesh>
        {children}
        {grid ? <Grid /> : null}
      </group>
    );
  }
};

export function Box({ values }) {
  const { base, v0, v1, v2, v3, v4, j0, j1, j2, j3, j4 } = values;

  const [selected, setSelected] = useState();

  return (
    <>
      <Grid />
      <Component
        name="base"
        setSelected={setSelected}
        selected={selected}
        args={[1, 1.5, base, 32]}
      >
        <Component
          name="j0"
          setSelected={setSelected}
          selected={selected}
          args={[1, 1, 1, 32]}
          rotation={[0, j0, 0]}
          position={[0, base / 2 + 0.5, 0]}
        >
          <Component
            name="v0"
            setSelected={setSelected}
            selected={selected}
            radius={0.1}
            args={[1, 1, v0, 32]}
            position={[0, v0 / 2 + 0.5, 0]}
          >
            <Component
              name="j1"
              rotation={[j1, 0, Math.PI / 2]}
              setSelected={setSelected}
              selected={selected}
              args={[1, 1, 1, 32]}
              position={[0, v0 / 2 + 1, 0]}
            >
              <Component
                name="v1"
                setSelected={setSelected}
                selected={selected}
                rotation={[0, 0, Math.PI / 2]}
                args={[1, 1, v1, 32]}
                position={[v1 / 2 + 1, 0, 0]}
                doubleV
              >
                <Component
                  name="j2"
                  rotation={[j2, 0, Math.PI / 2]}
                  setSelected={setSelected}
                  selected={selected}
                  args={[1, 1, 1, 32]}
                  position={[0, -(v1 / 2 + 1), 0]}
                  // grid
                >
                  <Component
                    name="v2"
                    setSelected={setSelected}
                    selected={selected}
                    rotation={[0, Math.PI * 1, Math.PI / 2]}
                    args={[1, 1, v2, 32]}
                    position={[-(v2 / 2 + 1), 0, 0]}
                  >
                    <Component
                      name="j3"
                      rotation={[0, j3, 0]}
                      setSelected={setSelected}
                      selected={selected}
                      args={[1, 1, 1, 32]}
                      position={[0, -(v2 / 2 + 0.5), 0]}
                      // grid
                    >
                      <Component
                        name="v3"
                        setSelected={setSelected}
                        selected={selected}
                        rotation={[0, 0, Math.PI]}
                        args={[1, 1, v3, 32]}
                        position={[0, -(v3 / 2 + 0.5), 0]}
                      >
                        <Component
                          name="j4"
                          rotation={[j4, 0, Math.PI / 2]}
                          setSelected={setSelected}
                          selected={selected}
                          args={[1, 1, 1, 32]}
                          position={[0, v3 / 2 + 1, 0]}
                          // grid
                        >
                          <Component
                            name="v4"
                            setSelected={setSelected}
                            selected={selected}
                            rotation={[0, 0, Math.PI / 2]}
                            args={[1, 1, v4, 32]}
                            position={[v4 / 2 + 1, 0, 0]}
                          ></Component>
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
    </>
  );
}
