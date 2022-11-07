import express from 'express';
import cors from 'cors';
import path, { dirname } from 'path';
import bodyParser from 'body-parser';

import health from './routes/health.js';
import fail from './routes/fail.js';
import waypoints from './routes/waypoints.js';
import recipes from './routes/recipes.js';
import robots from './routes/robots.js';
import errorHandler from './middleware/errorHandler.js';
import proxy from './middleware/proxy.js';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const createApp = ({ corsConfig }) => {
  // Create Express application
  const app = express();

  // Health endpoint
  app.use(health);

  // Fail endpoints
  app.use('/fail', fail);

  // Apply CORS to the endpoints
  app.use(cors(corsConfig));

  // Add body parser
  app.use(bodyParser.json());

  // Add error handler
  app.use(errorHandler);

  // Waypoint endpoints
  app.use('/waypoints', waypoints);

  // Recipe endpoints
  app.use('/recipes', recipes);

  // Robot endpoints
  app.use('/robots', robots);

  // Route for static content
  if (process.env.NODE_ENV === 'development') {
    // Route for static content
    app.use('/static', express.static(path.join(__dirname, './static')));
    // Route to dev server when developing
    app.use('/*', proxy('http://127.0.0.1:9001'));
  } else {
    // Routes for static content
    app.use('/static', express.static(path.join(__dirname, './static')));
    app.use(express.static(path.join(__dirname, '../client'), { redirect: false }));

    /* final catch-all route to index.html defined last */
    app.get('/*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/index.html'));
    });
  }

  return app;
};

export default createApp;
