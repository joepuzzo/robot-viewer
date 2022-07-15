import { useFormState } from 'informed';
import React, { useRef, useState } from 'react';

// export const Box = ({ config }) => {
//   const { x, y, z } = config;

//   return (
//     <mesh rotation={[90, 0, 20]}>
//       <boxBufferGeometry attach="geometry" args={[x, y, z]} />
//       <meshStandardMaterial attach="material" color="rgba(177,141,32)" />
//     </mesh>
//   );
// };

const Component = ({ name, setSelected, selected, args, ...props }) => {
  const [hovered, setHover] = useState(false);

  // This reference will give us direct access to the mesh
  const mesh = useRef();

  let color = 'orange';

  if (selected === name) {
    color = 'rgb(15, 67, 142)';
  } else if (hovered) {
    color = 'rgb(99, 99, 97)';
  }

  return (
    <mesh
      {...props}
      ref={mesh}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover()}
      onClick={(event) =>
        setSelected((prev) => {
          return prev === name ? undefined : name;
        })
      }
    >
      <cylinderGeometry args={args} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export function Box({ values }) {
  const { base } = values;

  const [selected, setSelected] = useState();

  return (
    <>
      <Component
        name="j0"
        setSelected={setSelected}
        selected={selected}
        args={[1, 1, 1, 32]}
        position={[0, base, 0]}
      />
      <Component
        name="base"
        setSelected={setSelected}
        selected={selected}
        args={[1, 1.5, base, 32]}
        position={[0, 0, 0]}
      />
    </>
  );
}
