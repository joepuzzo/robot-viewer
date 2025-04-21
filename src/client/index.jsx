import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App/App.jsx';
import AppProvider from './providers/AppProvider.jsx';
import SimulateProvider from './providers/SimulateProvider.jsx';
import RobotProvider from './providers/RobotProvider.jsx';
import ControlProvider from './providers/ControlProvider.jsx';

import { Informed } from 'informed';

/* ---- Include global variables first ---- */
import '@spectrum-css/vars/dist/spectrum-global.css';

/* ---- Include only the scales your application needs ---- */
import '@spectrum-css/vars/dist/spectrum-large.css';
import '@spectrum-css/vars/dist/spectrum-medium.css';

/* ---- Include only the colorstops your application needs ---- */
import '@spectrum-css/vars/dist/spectrum-light.css';
import '@spectrum-css/vars/dist/spectrum-dark.css';
import '@spectrum-css/vars/dist/spectrum-darkest.css';

/* ---- Include index-vars.css for all components you need ---- */
import '@spectrum-css/page/dist/index-vars.css';
import '@spectrum-css/typography/dist/index-vars.css';
import '@spectrum-css/sidenav/dist/index-vars.css';

import './index.css';
import GamepadProvider from './providers/GamepadProvider.jsx';
import CameraProvider from './providers/CameraProvider.jsx';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement); // createRoot(container!) if you use TypeScript

root.render(
  <AppProvider>
    <Informed>
      <GamepadProvider>
        <CameraProvider>
          <ControlProvider>
            <RobotProvider>
              <SimulateProvider>
                <App />
              </SimulateProvider>
            </RobotProvider>
          </ControlProvider>
        </CameraProvider>
      </GamepadProvider>
    </Informed>
  </AppProvider>,
);
