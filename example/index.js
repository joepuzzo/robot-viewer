#!/usr/bin/env node

import { startServer } from './server.js';

// Define default config
const config = {
  port: 80, // client port to connect to
  host: 'localhost', // client url to connect to
};

// Process the arguments
process.argv.forEach(function (val, i, arr) {
  switch (val) {
    case '-p':
    case '--port':
      config.port = arr[i + 1];
      break;
    case '-h':
    case '--host':
      config.host = arr[i + 1];
      break;
    case '--url':
      config.url = arr[i + 1];
      break;
    case '--id':
      config.id = arr[i + 1];
      break;
    case '--key':
      config.key = arr[i + 1];
      break;
    default:
  }
});

// Start the server
startServer(config);
