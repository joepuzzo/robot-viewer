import React, { Suspense, useMemo } from 'react';
import { ActionButton, Button, defaultTheme, Flex, Provider } from '@adobe/react-spectrum';
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
import Switch from '../Informed/Switch';
import NumberInput from '../Informed/NumberInput';
import RadioGroup from '../Informed/RadioGroup';
import { inverse } from '../../../lib/inverse';
import { toRadians } from '../../../lib/toRadians';
import { toDeg } from '../../../lib/toDeg';
import { round } from '../../../lib/round';

import ArrowDown from '@spectrum-icons/workflow/ArrowDown';
import ArrowUp from '@spectrum-icons/workflow/ArrowUp';
import ArrowLeft from '@spectrum-icons/workflow/ArrowLeft';
import ArrowRight from '@spectrum-icons/workflow/ArrowRight';

const getZXZ = (orientation) => {
  switch (orientation) {
    case 'x':
      return [-90, -90, 0];
    case '-x':
      return [-270, -90, 0];
    case 'y':
      return [0, -90, 0];
    case '-y':
      return [-180, -90, 0];
    case 'z':
      return [0, 0, 0];
    case '-z':
      return [-90, -180, 0];
    default:
      break;
  }
};

const XYZ = () => {
  const { values } = useFormState();
  const formApi = useFormApi();

  const updateRobot = () => {
    const { base, v0, v1, v2, v3, v4, v5, goToX, goToY, goToZ, orientation } =
      formApi.getFormState().values;

    const [r1, r2, r3] = getZXZ(orientation);

    // We give in degrees so turn into rads
    const ro1 = toRadians(r1);
    const ro2 = toRadians(r2);
    const ro3 = toRadians(r3);

    const angles = inverse(goToX, goToY, goToZ, ro1, ro2, ro3, {
      // a1: base + 0.5 + v0 + 1.5, // 4
      // a2: v1 + 2, // 3
      // a3: v2 + 1.5, // 2.5
      // a4: v3 + 1.5, // 2.5
      // a5: v4 + 1, // 2.5
      // a6: v5 + 1.5, // 2.5
      a1: base + v0,
      a2: v1,
      a3: v2,
      a4: v3,
      a5: v4,
      a6: v5,
    });

    console.log('Setting angles to', angles);

    if (!angles.find((a) => isNaN(a))) {
      formApi.setTheseValues({
        j0: toDeg(angles[0]),
        j1: toDeg(angles[1]),
        j2: toDeg(angles[2]),
        j3: toDeg(angles[3]),
        j4: toDeg(angles[4]),
        j5: toDeg(angles[5]),
        x: goToX,
        y: goToY,
        z: goToZ,
        r1,
        r2,
        r3,
      });
    }
  };

  return (
    <>
      <Flex
        direction="row"
        width={450}
        justifyContent="space-between"
        alignItems="end"
        gap="size-100"
      >
        <NumberInput
          name="goToX"
          label={`X: ${round(values.x, 100)}`}
          step={0.1}
          initialValue={6}
        />
        <NumberInput
          name="goToY"
          label={`Y: ${round(values.y, 100)}`}
          step={0.1}
          initialValue={1}
        />
        <NumberInput
          name="goToZ"
          label={`Z: ${round(values.z, 100)}`}
          step={0.1}
          initialValue={9}
        />
        <ActionButton type="button" onPress={updateRobot} minWidth="100">
          Go
        </ActionButton>
        <Switch name="animate" label="Animate" initialValue />
      </Flex>
      <br />
      <RadioGroup
        initialValue="x"
        orientation="horizontal"
        name="orientation"
        options={[
          { label: 'X', value: 'x' },
          { label: '-X', value: '-x' },
          { label: 'Y', value: 'y' },
          { label: '-Y', value: '-y' },
          { label: 'Z', value: 'z' },
          { label: '-Z', value: '-z' },
        ]}
      />
    </>
  );
};

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
          angles.map((a) => round(a, 100)),
          null,
          2
        )}
      </h3>
      <XYZ />
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
            config={config}
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
      // a1: config.base + 0.5 + config.v0 + 1.5, // 4
      // a2: config.v1 + 2, // 3
      // a3: config.v2 + 1.5, // 2.5
      // a4: config.v3 + 1.5, // 2.5
      // a5: config.v4 + 1, // 2.5
      // a6: config.v5 + 1.5, // 2.5
      a1: config.base + config.v0,
      a2: config.v1,
      a3: config.v2,
      a4: config.v3,
      a5: config.v4,
      a6: config.v5,
    });

    return {
      ...config,
      j0: toDeg(angles[0]),
      j1: toDeg(angles[1]),
      j2: toDeg(angles[2]),
      j3: toDeg(angles[3]),
      j4: toDeg(angles[4]),
      j5: toDeg(angles[5]),
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
