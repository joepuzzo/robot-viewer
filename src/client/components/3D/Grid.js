import React from 'react';
import { Line, Plane, Text } from '@react-three/drei';
import { toRadians } from '../../../lib/toRadians';

const XZPlane = ({ size, shift }) => {
  const height = shift ? size / 2 : size;

  const shifted = shift ? height / 2 : 0;

  return (
    <Plane
      args={[size, height, size / 10, height / 10]}
      rotation={[1.5 * Math.PI, 0, 0]}
      position={[0, 0, shifted]}
    >
      <meshStandardMaterial attach="material" color="#f9c74f" wireframe />
    </Plane>
  );
};

const XYPlane = ({ size }) => (
  <Plane args={[size, size, size / 10, size / 10]} rotation={[0, 0, 0]} position={[0, 0, 0]}>
    <meshStandardMaterial attach="material" color="pink" wireframe />
  </Plane>
);

const YZPlane = ({ size, shift }) => {
  const width = shift ? size / 2 : size;
  const shifted = shift ? width / 2 : 0;

  return (
    <Plane
      args={[width, size, width / 10, size / 10]}
      rotation={[0, Math.PI / 2, 0]}
      position={[0, 0, shifted]}
    >
      <meshStandardMaterial attach="material" color="#80ffdb" wireframe />
    </Plane>
  );
};

export default function Grid({
  size,
  hideNegatives,
  hidePosatives,
  showArrows,
  showPlanes = true,
  transparent,
  lineWidth = 3,
  showCylinder,
  shift,
  axisLabel,
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
          {axisLabel ? `X${axisLabel}+` : 'X+'}
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
          {axisLabel ? `X${axisLabel}-` : 'X-'}
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
          {axisLabel ? `Y${axisLabel}+` : 'Y+'}
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
          {axisLabel ? `Y${axisLabel}-` : 'Y-'}
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
          {axisLabel ? `Z${axisLabel}+` : 'Z+'}
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
          {axisLabel ? `Z${axisLabel}-` : 'Z-'}
        </Text>
      ) : null}
      {showPlanes ? <XZPlane size={size} shift={shift} /> : null}
      {showPlanes ? <XYPlane size={size} /> : null}
      {showPlanes ? <YZPlane size={size} shift={shift} /> : null}
      {showCylinder ? (
        <group rotation={[toRadians(90), 0, 0]}>
          <mesh>
            <cylinderGeometry args={[5, 5, 5, 32]} />
            <meshStandardMaterial color="yellow" opacity={0.5} transparent />
          </mesh>
        </group>
      ) : null}
    </group>
  );
}
