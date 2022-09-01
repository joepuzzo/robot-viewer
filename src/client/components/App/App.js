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
import { Data } from '../Data/Data';

import { inverse } from '../../../lib/inverse';
import { toRadians } from '../../../lib/toRadians';
import { toDeg } from '../../../lib/toDeg';

import { Routes } from '../Routes/Routes';

const App = () => {
  const { colorScheme, extraOpen } = useApp();

  const { loading, error } = useGet({
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
        <Header />
        <Nav />
        <main className={extraOpen ? 'extra' : ''}>
          <Routes />
        </main>
        <Data />
      </Provider>
    </Router>
  );
};

export default App;
