import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { LoadingManager } from 'three';
import URDFLoader from 'urdf-loader';

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

// New URDFRobot component
export const URDFRobot = () => {
  const { scene } = useThree();

  useEffect(() => {
    const manager = new LoadingManager();
    const loader = new URDFLoader(manager);

    // Custom mesh loading function
    loader.loadMeshCb = (path, manager, done) => {
      if (path.endsWith('.obj')) {
        const objLoader = new OBJLoader(manager);
        objLoader.load(path, done);
      } else {
        // Handle other file types or fallback to default behavior
        // ...
      }
    };

    // loader.load('static/rizon/flexiv_rizon4_kinematics.urdf', (robot) => {
    loader.load('static/test.urdf', (robot) => {
      scene.add(robot);
    });
  }, [scene]);

  return null;
};
