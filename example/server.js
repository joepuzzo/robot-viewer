import io from 'socket.io-client';
import { Robot } from './robot.js';
import { Debug } from './debug.js';

const logger = Debug('robot:server' + '\t');

export const startServer = (config) => {
  // Create socket
  const connectionString = `http://${config.host}:${config.port}/robot?id=${config.id}`;
  const socket = io(connectionString);
  logger('Created socket', connectionString);

  // Create robot
  const robot = new Robot(config);

  /* ---------- Subscribe to robot events ---------- */
  robot.on('state', () => {
    logger('Sending state');
    socket.emit('state', robot.state);
  });

  robot.on('encoder', () => {
    // Specifically don't log here (too much logging)
    socket.emit('encoder', robot.state);
  });

  robot.on('ready', () => {
    logger('Robot ready, sending state and registering');
    socket.emit('register', robot.meta);
    socket.emit('state', robot.state);
  });

  robot.on('meta', () => {
    logger('Sending meta');
    socket.emit('register', robot.meta);
  });

  robot.on('moved', () => {
    logger('Sending moved');
    socket.emit('moved', robot.meta);
  });

  robot.on('pulse', (id, pos) => {
    socket.emit('pulse', id);
  });

  /* ---------- Subscribe to socket events ---------- */
  socket.on('connect', () => {
    logger('Robot is connected to controller, sending state');
    if (robot.ready) {
      socket.emit('register', robot.meta);
      socket.emit('state', robot.state);
    }
  });

  socket.on('hello', (msg) => {
    logger('Controller says hello');
  });

  socket.on('motorSetPos', (id, pos, speed) => {
    logger(`Controller says setMotorPos to ${pos} at speed ${speed} for motor ${id}`);
    robot.motorSetPosition(id, pos, speed);
  });

  socket.on('motorResetErrors', (id) => {
    logger(`Controller says resetErrors for motor ${id}`);
    robot.motorResetErrors(id);
  });

  socket.on('motorEnable', (id) => {
    logger(`Controller says enableMotor ${id}`);
    robot.motorEnable(id);
  });

  socket.on('motorDisable', (id) => {
    logger(`Controller says disableMotor ${id}`);
    robot.motorDisable(id);
  });

  socket.on('motorCalibrate', (id) => {
    logger(`Controller says calibrateMotor ${id}`);
    robot.motorCalibrate(id);
  });

  socket.on('motorReference', (id) => {
    logger(`Controller says referenceMotor ${id}`);
    robot.motorReference(id);
  });

  socket.on('motorHome', (id) => {
    logger(`Controller says motorHome ${id}`);
    robot.motorHome(id);
  });

  socket.on('motorZero', (id) => {
    logger(`Controller says motorZero ${id}`);
    robot.motorZero(id);
  });

  socket.on('gripperSetPos', (pos, speed) => {
    logger(`Controller says gripperSetPos to ${pos} at speed ${speed}`);
    robot.gripperSetPosition(pos, speed);
  });

  socket.on('robotHome', () => {
    logger(`Controller says home robot`);
    robot.robotHome();
  });

  socket.on('robotSplitHome', () => {
    logger(`Controller says splitHome robot`);
    robot.robotSplitHome();
  });

  socket.on('robotStop', () => {
    logger(`Controller says stop robot`);
    robot.robotStop();
  });

  socket.on('robotFreeze', () => {
    logger(`Controller says freeze robot`);
    robot.robotFreeze();
  });

  socket.on('robotEnable', () => {
    logger(`Controller says enable robot`);
    robot.robotEnable();
  });

  socket.on('robotCenter', () => {
    logger(`Controller says center robot`);
    robot.robotCenter();
  });

  socket.on('robotSetAngles', (angles, speed) => {
    logger(`Controller says setAngles for robot`);
    robot.robotSetAngles(angles, speed);
  });

  socket.on('robotUpdateConfig', (key, value) => {
    logger(`Controller says updateConfig for robot`);
    robot.updateConfig(key, value);
  });

  socket.on('robotWriteConfig', () => {
    logger(`Controller says writeConfig for robot`);
    robot.writeConfig();
  });

  socket.on('robotAccelEnabled', (value) => {
    logger(`Controller says accelEnabled for robot to ${value}`);
    robot.robotAccelEnabled(value);
  });

  socket.on('disconnect', () => {
    logger('Robot is disconnected from controller');
  });

  socket.on('robotResetErrors', () => {
    logger(`Controller says resetErrors for robot`);
    robot.robotReset();
  });

  socket.on('robotReference', () => {
    logger(`Controller says reference robot`);
    robot.robotReference();
  });

  socket.on('robotZero', () => {
    logger(`Controller says zero robot`);
    robot.robotZero();
  });

  socket.on('home', () => {
    logger(`Controller says home robot`);
    robot.home();
  });

  socket.on('robotFreedriveEnable', (frame, cartFloatingAxis) => {
    logger(
      `Controller says enable freedrive with frame ${frame} and cartFloatingAxis ${cartFloatingAxis}`,
    );
    robot.robotFreedriveEnable(frame, cartFloatingAxis);
  });

  socket.on('robotFreedriveDisable', () => {
    logger(`Controller says disable freedrive`);
    robot.robotFreedriveDisable();
  });
};
