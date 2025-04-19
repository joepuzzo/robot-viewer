import React, { useMemo } from 'react';
import { defaultTheme, Provider } from '@adobe/react-spectrum';
import { FormProvider } from 'informed';
import { BrowserRouter as Router } from 'react-router-dom';

// Hooks
import useApp from '../../hooks/useApp';
import { useGet } from '../../hooks/useGet';

// Components
import { Header } from '../Header/Header';
import { Nav } from '../Nav/Nav';
import { Data } from '../Data/Data';

import { Routes } from '../Routes/Routes';
import { Extra } from '../Extra/Extra';

const App = () => {
  const { colorScheme, extraOpen } = useApp();

  const [{ loading, error }] = useGet({
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
        <div className="app" id="app">
          <Nav />
          <main>
            <Header />
            <Routes />
          </main>
          <Data />
        </div>
        <Extra />
      </Provider>
    </Router>
  );
};

export default App;
