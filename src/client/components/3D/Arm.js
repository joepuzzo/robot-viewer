import React, { Suspense } from 'react';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function Scene() {
  // const obj = useLoader(OBJLoader, '/static/IGUS_6DOF.obj');
  // return <primitive object={obj} />;

  const gltf = useLoader(GLTFLoader, '/static/IGUS_6DOF_GLTF.gltf');
  return <primitive object={gltf.scene} scale={10} />;
}

export const Arm = ({ config }) => {
  return <Scene />;
};
