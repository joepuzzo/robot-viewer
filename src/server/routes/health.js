import express from 'express';
import logger from 'winston';

const router = express.Router();

router.get('/health', (req, res) => {
  const status = { status: 'UP' };
  // Note: we specifically DONT log here because F5 pings health too much
  return res.send(status);
});

router.get('/readiness', (req, res) => {
  const status = { status: 'UP' };
  logger.info('readiness', status);
  return res.send(status);
});

router.get('/liveness', (req, res) => {
  const status = { status: 'UP' };
  logger.info('liveness', status);
  return res.send(status);
});

export default router;