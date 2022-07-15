import http from 'http';

import app from './app.js';
import setup from './setup.js';
import terminate from './terminate.js';

const start = async () => {
  try {
    // Setup configuration ( database connections, etc )
    const configuration = await setup();
    // Build express app
    const application = app(configuration);
    // Create server
    const server = http.createServer(application).listen(configuration.PORT, () => {
      console.log('Server is now running on port', configuration.PORT);
    });

    // Add Terminate code
    const exitHandler = terminate(server, {
      coredump: false,
      timeout: 500,
    });
    process.on('uncaughtException', exitHandler(1, 'Unexpected Error'));
    process.on('unhandledRejection', exitHandler(1, 'Unhandled Promise'));
    process.on('SIGTERM', exitHandler(0, 'SIGTERM'));
    process.on('SIGINT', exitHandler(0, 'SIGINT'));
  } catch (e) {
    console.log('An error occurred when attempting to start application', e);
  }
};

start();
