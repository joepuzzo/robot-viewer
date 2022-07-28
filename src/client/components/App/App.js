import React, { Suspense, useMemo } from 'react';
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
import { inverse } from '../../../lib/inverse';
import { toRadians } from '../../../lib/toRadians';

const toDeg = (rad) => {
  return 180 * (rad / Math.PI);
};

const round = (n) => Math.round(n * 100) / 100;

const Robot = ({ config, orbitEnabled, toggleOrbital }) => {
  const { values } = useFormState();
  const formApi = useFormApi();
  const { RobotKin, control } = useApp();

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
          zoom: 0.8,
        }}
        // camera={{ fov: 35, aspect: window.innerWidth / window.innerHeight, near: 1, far: 1000 }}
        // camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 10000)
      >
        <OrbitControls enabled={orbitEnabled} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[-2, 5, 2]} intensity={1} />
        <Suspense fallback={null}>
          <BoxZ
            control={control}
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

  const initialValues = useMemo(() => {
    // We give in degrees so turn into rads
    const ro1 = toRadians(config.r1);
    const ro2 = toRadians(config.r2);
    const ro3 = toRadians(config.r3);

    console.log('Initial getting angles for', [config.x, config.y, config.z, ro1, ro2, ro3]);

    const angles = inverse(config.x, config.y, config.z, ro1, ro2, ro3, {
      a1: config.base + 0.5 + config.v0 + 1.5, // 2.5
      a2: config.v1 + 2, // 3
      a3: config.v2 + 1.5, // 2.5
      a4: config.v3 + 1.5, // 2.5
      a5: config.v4 + 1, // 2.5
      a6: config.v5 + 1.5, // 2
    });

    return {
      ...config,
      j0: angles[0],
      j1: angles[1],
      j2: angles[2],
      j3: angles[3],
      j4: angles[4],
      j5: angles[5],
    };
  }, []);

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
      <FormProvider initialValues={initialValues}>
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
