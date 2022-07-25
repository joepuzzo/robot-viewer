import React, { Suspense } from 'react';
import { defaultTheme, Provider } from '@adobe/react-spectrum';
import { OrbitControls } from '@react-three/drei';
import { Debug, FormProvider, useFormApi, useFormState } from 'informed';

// Hooks
import useApp from '../../hooks/useApp';
import useGet from '../../hooks/useGet';

// Components
import { Header } from '../Header/Header';
import { Nav } from '../Nav/Nav';
import { Canvas } from '@react-three/fiber';
import { Box } from '../3D/Box';
import { BoxZ } from '../3D/BoxZ';
import { Arm } from '../3D/Arm';

const toDeg = (rad) => {
  return 180 * (rad / Math.PI);
};

const round = (n) => Math.round(n * 100) / 100;

const Robot = ({ config, orbitEnabled, toggleOrbital }) => {
  const { values } = useFormState();
  const formApi = useFormApi();
  const { RobotKin } = useApp();

  const { j0, j1, j2, j3, j4, j5 } = values;

  const angles = [j0, j1, j2, j3, j4, j5];

  // const pos = RobotKin.forward(...angles)[5].map((a) => Math.round(a));

  return (
    <>
      {/* <h3>{JSON.stringify(pos)}</h3> */}
      <h3>
        Angles:{' '}
        {JSON.stringify(
          angles.map((a) => round(toDeg(a))),
          null,
          2
        )}
      </h3>
      <Canvas
        // orthographic
        // camera={{
        //   position: [25, 25, 25],
        //   zoom: 40,
        //   left: window.innerWidth / -2,
        //   right: window.innerWidth / 2,
        //   top: window.innerHeight / 2,
        //   bottom: window.innerHeight / -2,
        // }}
        camera={{
          fov: 75,
          aspect: window.innerWidth / window.innerHeight,
          near: 0.1,
          far: 1000,
          position: [8, 12, 10],
          zoom: 0.6,
        }}
        // camera={{ fov: 35, aspect: window.innerWidth / window.innerHeight, near: 1, far: 1000 }}
        // camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 10000)
      >
        <OrbitControls enabled={orbitEnabled} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[-2, 5, 2]} intensity={1} />
        <Suspense fallback={null}>
          <BoxZ
            values={values}
            formApi={formApi}
            RobotKin={RobotKin}
            toggleOrbital={toggleOrbital}
          />
        </Suspense>
      </Canvas>
    </>
  );
};

const App = () => {
  const { colorScheme, config, orbitEnabled, toggleOrbital } = useApp();

  const { loading, error, data } = useGet({
    url: '/health',
  });

  if (loading) {
    return <span>Loading...</span>;
  }

  if (error) {
    return <span>{error.message}</span>;
  }

  return (
    <Provider theme={defaultTheme} colorScheme={colorScheme}>
      <FormProvider initialValues={config}>
        <Header />
        <Nav />
        <main>
          {/* <h1>Robot Viewer</h1>
          <h2>Health Check {data.status}</h2> */}
          {/* <Debug /> */}
          <Robot config={config} orbitEnabled={orbitEnabled} toggleOrbital={toggleOrbital} />
          {/* <Canvas>
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <directionalLight intensity={2} />
            <OrbitControls />
            <Arm />
          </Suspense>
        </Canvas> */}
        </main>
      </FormProvider>
    </Provider>
  );
};

export default App;
