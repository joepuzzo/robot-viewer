import React, { useMemo } from 'react';
import { defaultTheme, Provider } from '@adobe/react-spectrum';
import { FormProvider } from 'informed';
import { BrowserRouter as Router } from 'react-router-dom';

// Hooks
import useApp from '../../hooks/useApp';
import useGet from '../../hooks/useGet';

// Components
import { Header } from '../Header/Header';
import { Nav } from '../Nav/Nav';

import { inverse } from '../../../lib/inverse';
import { toRadians } from '../../../lib/toRadians';
import { toDeg } from '../../../lib/toDeg';

import { Routes } from '../Routes/Routes';

const App = () => {
  const { colorScheme, config, extraOpen } = useApp();

  const initialValues = useMemo(() => {
    // We give in degrees so turn into rads
    const ro1 = toRadians(config.r1);
    const ro2 = toRadians(config.r2);
    const ro3 = toRadians(config.r3);

    console.log('Initial getting angles for', [config.x, config.y, config.z, ro1, ro2, ro3]);

    const angles = inverse(config.x, config.y, config.z, ro1, ro2, ro3, {
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
    <Router>
      <Provider theme={defaultTheme} colorScheme={colorScheme}>
        <FormProvider initialValues={initialValues} name="robot">
          <Header />
          <Nav />
          <main className={extraOpen ? 'extra' : ''}>
            <Routes />
          </main>
        </FormProvider>
      </Provider>
    </Router>
  );
};

export default App;
