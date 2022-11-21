import React from 'react';
import { Line, Plane, Text } from '@react-three/drei';

const XZPlane = ({ size }) => (
  <Plane
    args={[size, size, size / 10, size / 10]}
    rotation={[1.5 * Math.PI, 0, 0]}
    position={[0, 0, 0]}
  >
    <meshStandardMaterial attach="material" color="#f9c74f" wireframe />
  </Plane>
);

const XYPlane = ({ size }) => (
  <Plane args={[size, size, size / 10, size / 10]} rotation={[0, 0, 0]} position={[0, 0, 0]}>
    <meshStandardMaterial attach="material" color="pink" wireframe />
  </Plane>
);

const YZPlane = ({ size }) => (
  <Plane
    args={[size, size, size / 10, size / 10]}
    rotation={[0, Math.PI / 2, 0]}
    position={[0, 0, 0]}
  >
    <meshStandardMaterial attach="material" color="#80ffdb" wireframe />
  </Plane>
);

export default function Grid({
  size,
  hideNegatives,
  hidePosatives,
  showArrows,
  showPlanes = true,
  transparent,
  lineWidth = 3,
}) {
  return (
    <group>
      {!hidePosatives ? (
        <Text
          color="white" // default
          anchorX="center" // default
          anchorY="middle" // default
          position={[size / 2 + 10, 0, 0]}
          scale={[40, 40, 40]}
        >
          X+
        </Text>
      ) : null}
      {showArrows ? (
        <Line
          rotation={[0, 0, 0]}
          points={[
            [0, 0, 0],
            [size / 2 + 5, 0, 0],
          ]}
          color="red"
          lineWidth={lineWidth}
          opacity={transparent ? 0.3 : 1}
          transparent={transparent}
        />
      ) : null}
      {!hideNegatives ? (
        <Text
          color="white" // default
          anchorX="center" // default
          anchorY="middle" // default
          position={[-size / 2 - 10, 0, 0]}
          scale={[40, 40, 40]}
        >
          X-
        </Text>
      ) : null}
      {!hidePosatives ? (
        <Text
          color="white" // default
          anchorX="center" // default
          anchorY="middle" // default
          position={[0, size / 2 + 10, 0]}
          scale={[40, 40, 40]}
        >
          Y+
        </Text>
      ) : null}
      {showArrows ? (
        <Line
          rotation={[0, 0, 0]}
          points={[
            [0, 0, 0],
            [0, size / 2 + 5, 0],
          ]}
          color="green"
          lineWidth={lineWidth}
          opacity={transparent ? 0.3 : 1}
          transparent={transparent}
        />
      ) : null}
      {!hideNegatives ? (
        <Text
          color="white" // default
          anchorX="center" // default
          anchorY="middle" // default
          position={[0, -size / 2 - 10, 0]}
          scale={[40, 40, 40]}
        >
          Y-
        </Text>
      ) : null}
      {!hidePosatives ? (
        <Text
          color="white" // default
          anchorX="center" // default
          anchorY="middle" // default
          position={[0, 0, size / 2 + 10]}
          scale={[40, 40, 40]}
        >
          Z+
        </Text>
      ) : null}
      {showArrows ? (
        <Line
          rotation={[0, 0, 0]}
          points={[
            [0, 0, 0],
            [0, 0, size / 2 + 5],
          ]}
          color="blue"
          lineWidth={lineWidth}
          opacity={transparent ? 0.3 : 1}
          transparent={transparent}
        />
      ) : null}
      {!hideNegatives ? (
        <Text
          color="white" // default
          anchorX="center" // default
          anchorY="middle" // default
          position={[0, 0, -size / 2 - 10]}
          scale={[40, 40, 40]}
        >
          Z-
        </Text>
      ) : null}
      {showPlanes ? <XZPlane size={size} /> : null}
      {showPlanes ? <XYPlane size={size} /> : null}
      {showPlanes ? <YZPlane size={size} /> : null}
    </group>
  );
}
