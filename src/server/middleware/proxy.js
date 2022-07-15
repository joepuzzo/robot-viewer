import request from 'request';
import logger from 'winston';

/**
 * Helper function to handle errors when they occur
 * @param {*} res - response object
 * @param {*} e - the error to log
 * @param {*} path - path that was attepted to proxy to
 */
const handleError = (res, e, path) => {
  console.error(`Unable to forward request to ${path}`, e);
  res.sendStatus(500);
};

/**
 * Function that generates a piece of proxy middleware
 *
 * Example usage: app.use('/foo', proxy('http://localhost:6900'))
 *
 * @param {*} to - where to proxy the requests to
 */
const proxy = to => (req, res) => {
  const path = `${to}${req.originalUrl}`;
  logger.info(`Forwarding request to ${path}`);
  req
    .pipe(request(path))
    .on('error', e => handleError(res, e, path))
    .pipe(res);
};

export default proxy;