import React, { Suspense } from 'react';
import { defaultTheme, Provider } from '@adobe/react-spectrum';
import { OrbitControls } from '@react-three/drei';
import { FormProvider, useFormState } from 'informed';

// Hooks
import useApp from '../../hooks/useApp';
import useGet from '../../hooks/useGet';

// Components
import { Header } from '../Header/Header';
import { Nav } from '../Nav/Nav';
import { Canvas } from '@react-three/fiber';
import { Box } from '../3D/Box';
import { Arm } from '../3D/Arm';

const Robot = () => {
  const { values } = useFormState();
  return (
    <Canvas camera={{ fov: 75, near: 0.1, far: 1000, position: [1, 5, 5] }}>
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <directionalLight position={[-2, 5, 2]} intensity={1} />
      <Suspense fallback={null}>
        <Box values={values} />
      </Suspense>
    </Canvas>
  );
};

const App = () => {
  const { colorScheme, config } = useApp();

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
      <FormProvider>
        <Header />
        <Nav />
        <main>
          <h1>Robot Viewer</h1>
          <h2>Health Check {data.status}</h2>
          <Robot />
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
