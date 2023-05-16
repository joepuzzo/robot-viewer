import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App.js';
import AppProvider from './providers/AppProvider.js';
import SimulateProvider from './providers/SimulateProvider.js';
import RobotProvider from './providers/RobotProvider.js';
import ControlProvider from './providers/ControlProvider.js';

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
import GamepadProvider from './providers/GamepadProvider.js';

const rootElement = document.getElementById('root');
ReactDOM.render(
  <AppProvider>
    <Informed>
      <GamepadProvider>
        <ControlProvider>
          <RobotProvider>
            <SimulateProvider>
              <App />
            </SimulateProvider>
          </RobotProvider>
        </ControlProvider>
      </GamepadProvider>
    </Informed>
  </AppProvider>,
  rootElement
);
