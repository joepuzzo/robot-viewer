import { RobotMessenger } from './robot-messenger.js';
import { ClientMessenger } from './client-messenger.js';
import { CameraMessenger } from './camera-messenger.js';

import { Debug } from '../../lib/debug.js';
const logger = Debug('robot:controller' + '');
export class Controller {
  constructor({ io }) {
    logger('controller constructing controller');
    // Set our io
    this.io = io;
    // Map to keep track of robots
    this.robots = {};
    // Create robot messsenger so we can talk to robots
    this.robotMessenger = new RobotMessenger(io);
    // Create client messsenger so we can talk to clients
    this.clientMessenger = new ClientMessenger(io);
    // Create camera messenger
    this.cameraMessenger = new CameraMessenger(io);
    // Bind to bucket events
    this.subscribeToRobotMessenger();
    // Bind to client events
    this.subscribeToClientMessenger();
    // Bind to camera events
    this.subscribeToCameraMessenger();
  }

  /* -------------- Client Shit -------------- */

  clientConnect() {
    logger('controller client connected');
    this.clientMessenger.send('robots', this.robots);
  }

  clientDisconnect() {
    logger(`controller client disconnected`);
  }

  clientHello(...args) {
    logger(`controller client says hello`, args);
  }

  gripperSetPos(robotId, pos, speed, force, wait) {
    logger(`controller client says gripperSetPos`, robotId, pos, speed, force, wait);
    // only send if we are connected
    if (this.robots[robotId]) {
      const socketId = this.robots[robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'gripperSetPos', pos, speed, force, wait);
    }
  }

  motorSetPos(robotId, motorId, pos) {
    logger(`controller client says motorSetPos`, robotId, motorId, pos);
    // only send if we are connected
    if (this.robots[robotId]) {
      const socketId = this.robots[robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'motorSetPos', motorId, pos);
    }
  }

  motorResetErrors(robotId, motorId) {
    logger(`controller client says motorResetErrors`, robotId, motorId);
    // only send if we are connected
    if (this.robots[robotId]) {
      const socketId = this.robots[robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'motorResetErrors', motorId);
    }
  }

  motorEnable(robotId, motorId) {
    logger(`controller client says motorEnable`, robotId, motorId);
    // only send if we are connected
    if (this.robots[robotId]) {
      const socketId = this.robots[robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'motorEnable', motorId);
    }
  }

  motorDisable(robotId, motorId) {
    logger(`controller client says motorDisable`, robotId, motorId);
    // only send if we are connected
    if (this.robots[robotId]) {
      const socketId = this.robots[robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'motorDisable', motorId);
    }
  }

  queryMotorPosition(robotId, motorId) {
    logger(`controller client says queryMotorPosition`, robotId, motorId);
    // only send if we are connected
    if (this.robots[robotId]) {
      const socketId = this.robots[robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'queryMotorPosition', motorId);
    }
  }

  queryMotorParameter(robotId, motorId, index, subindex) {
    logger(`controller client says queryMotorParameter`, robotId, motorId, index, subindex);
    // only send if we are connected
    if (this.robots[robotId]) {
      const socketId = this.robots[robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'queryMotorParameter', motorId, index, subindex);
    }
  }

  motorCalibrate(robotId, motorId) {
    logger(`controller client says motorCalibrate`, robotId, motorId);
    // only send if we are connected
    if (this.robots[robotId]) {
      const socketId = this.robots[robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'motorCalibrate', motorId);
    }
  }

  motorReference(robotId, motorId) {
    logger(`controller client says motorReference`, robotId, motorId);
    // only send if we are connected
    if (this.robots[robotId]) {
      const socketId = this.robots[robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'motorReference', motorId);
    }
  }

  robotReference(robotId) {
    logger(`controller client says robotReference`, robotId);
    // only send if we are connected
    if (this.robots[robotId]) {
      const socketId = this.robots[robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'robotReference');
    }
  }

  robotZero(robotId) {
    logger(`controller client says robotZero`, robotId);
    // only send if we are connected
    if (this.robots[robotId]) {
      const socketId = this.robots[robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'robotZero');
    }
  }

  robotZeroFT(robotId) {
    logger(`controller client says robotZeroFT`, robotId);
    // only send if we are connected
    if (this.robots[robotId]) {
      const socketId = this.robots[robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'robotZeroFT');
    }
  }

  motorZero(robotId, motorId) {
    logger(`controller client says motorZero`, robotId, motorId);
    // only send if we are connected
    if (this.robots[robotId]) {
      const socketId = this.robots[robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'motorZero', motorId);
    }
  }

  motorHome(robotId, motorId) {
    logger(`controller client says motorHome`, robotId, motorId);
    // only send if we are connected
    if (this.robots[robotId]) {
      const socketId = this.robots[robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'motorHome', motorId);
    }
  }

  robotHome(robotId) {
    logger(`controller client says robotHome`, robotId);
    // only send if we are connected
    if (this.robots[robotId]) {
      const socketId = this.robots[robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'robotHome');
    }
  }

  robotCalibrate(robotId) {
    logger(`controller client says robotCalibrate`, robotId);
    // only send if we are connected
    if (this.robots[robotId]) {
      const socketId = this.robots[robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'robotCalibrate');
    }
  }

  robotResetErrors(robotId) {
    logger(`controller client says robotResetErrors`, robotId);
    // only send if we are connected
    if (this.robots[robotId]) {
      const socketId = this.robots[robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'robotResetErrors');
    }
  }

  robotAccelEnabled(robotId, value) {
    logger(`controller client says robotAccelEnabled`, robotId, value);
    // only send if we are connected
    if (this.robots[robotId]) {
      const socketId = this.robots[robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'robotAccelEnabled', value);
    }
  }

  robotFreedriveEnable(robotId, freedriveFrame, cartFloatingAxis, nullspace) {
    logger(
      `controller client says robotFreedriveEnable`,
      robotId,
      freedriveFrame,
      cartFloatingAxis,
      nullspace,
    );
    // only send if we are connected
    if (this.robots[robotId]) {
      const socketId = this.robots[robotId].socketId;
      this.robotMessenger.sendTo(
        socketId,
        'robotFreedriveEnable',
        freedriveFrame,
        cartFloatingAxis,
        nullspace,
      );
    }
  }

  robotJointFreedriveEnable(robotId, joints) {
    logger(`controller client says robotJointFreedriveEnable`, robotId, joints);
    // only send if we are connected
    if (this.robots[robotId]) {
      const socketId = this.robots[robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'robotJointFreedriveEnable', joints);
    }
  }

  robotFreedriveDisable(robotId) {
    logger(`controller client says robotFreedriveDisable`, robotId);
    // only send if we are connected
    if (this.robots[robotId]) {
      const socketId = this.robots[robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'robotFreedriveDisable');
    }
  }

  robotSplitHome(robotId) {
    logger(`controller client says robotSplitHome`, robotId);
    // only send if we are connected
    if (this.robots[robotId]) {
      const socketId = this.robots[robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'robotSplitHome');
    }
  }

  robotStop(robotId) {
    logger(`controller client says robotStop`, robotId);
    // only send if we are connected
    if (this.robots[robotId]) {
      const socketId = this.robots[robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'robotStop');
    }
  }

  robotFreeze(robotId) {
    logger(`controller client says robotFreeze`, robotId);
    // only send if we are connected
    if (this.robots[robotId]) {
      const socketId = this.robots[robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'robotFreeze');
    }
  }

  robotCenter(robotId) {
    logger(`controller client says robotCenter`, robotId);
    // only send if we are connected
    if (this.robots[robotId]) {
      const socketId = this.robots[robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'robotCenter');
    }
  }

  robotUpdateConfig(robotId, key, value) {
    logger(`controller client says update ${key} to ${value} for robot ${robotId}`);
    // only send if we are connected
    if (this.robots[robotId]) {
      const socketId = this.robots[robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'robotUpdateConfig', key, value);
    }
  }

  robotWriteConfig(robotId) {
    logger(`controller client says write config for robot ${robotId}`);
    // only send if we are connected
    if (this.robots[robotId]) {
      const socketId = this.robots[robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'robotWriteConfig');
    }
  }

  robotEnable(robotId) {
    logger(`controller client says robotEnable`, robotId);
    // only send if we are connected
    if (this.robots[robotId]) {
      const socketId = this.robots[robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'robotEnable');
    }
  }

  robotSetAngles(robotId, angles, speed) {
    logger(`controller client says robotSetAngles`, robotId);
    // only send if we are connected
    if (this.robots[robotId]) {
      const socketId = this.robots[robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'robotSetAngles', angles, speed);
    }
  }

  robotMoveL(robotId, parameters) {
    logger(`controller client says robotMoveL ${robotId} with parameters ${parameters}`);
    // only send if we are connected
    if (this.robots[robotId]) {
      const socketId = this.robots[robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'robotMoveL', parameters);
    }
  }

  robotMoveContact(robotId, parameters) {
    logger(`controller client says robotMoveContact ${robotId} with parameters ${parameters}`);
    // only send if we are connected
    if (this.robots[robotId]) {
      const socketId = this.robots[robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'robotMoveContact', parameters);
    }
  }

  subscribeToClientMessenger() {
    this.clientMessenger.on('hello', (...args) => this.clientHello(...args));
    this.clientMessenger.on('connect', (...args) => this.clientConnect(...args));
    this.clientMessenger.on('disconnect', (...args) => this.clientDisconnect(...args));
    this.clientMessenger.on('gripperSetPos', (...args) => this.gripperSetPos(...args));
    this.clientMessenger.on('motorSetPos', (...args) => this.motorSetPos(...args));
    this.clientMessenger.on('motorResetErrors', (...args) => this.motorResetErrors(...args));
    this.clientMessenger.on('motorEnable', (...args) => this.motorEnable(...args));
    this.clientMessenger.on('motorDisable', (...args) => this.motorDisable(...args));
    this.clientMessenger.on('motorCalibrate', (...args) => this.motorCalibrate(...args));
    this.clientMessenger.on('motorReference', (...args) => this.motorReference(...args));
    this.clientMessenger.on('robotReference', (...args) => this.robotReference(...args));
    this.clientMessenger.on('robotZero', (...args) => this.robotZero(...args));
    this.clientMessenger.on('robotZeroFT', (...args) => this.robotZeroFT(...args));
    this.clientMessenger.on('queryMotorPosition', (...args) => this.queryMotorPosition(...args));
    this.clientMessenger.on('queryMotorParameter', (...args) => this.queryMotorParameter(...args));
    this.clientMessenger.on('motorZero', (...args) => this.motorZero(...args));
    this.clientMessenger.on('motorHome', (...args) => this.motorHome(...args));
    this.clientMessenger.on('robotHome', (...args) => this.robotHome(...args));
    this.clientMessenger.on('robotCalibrate', (...args) => this.robotCalibrate(...args));
    this.clientMessenger.on('robotResetErrors', (...args) => this.robotResetErrors(...args));
    this.clientMessenger.on('robotAccelEnabled', (...args) => this.robotAccelEnabled(...args));
    this.clientMessenger.on('robotSplitHome', (...args) => this.robotSplitHome(...args));
    this.clientMessenger.on('robotStop', (...args) => this.robotStop(...args));
    this.clientMessenger.on('robotFreeze', (...args) => this.robotFreeze(...args));
    this.clientMessenger.on('robotCenter', (...args) => this.robotCenter(...args));
    this.clientMessenger.on('robotEnable', (...args) => this.robotEnable(...args));
    this.clientMessenger.on('robotSetAngles', (...args) => this.robotSetAngles(...args));
    this.clientMessenger.on('robotMoveL', (...args) => this.robotMoveL(...args));
    this.clientMessenger.on('robotMoveContact', (...args) => this.robotMoveContact(...args));
    this.clientMessenger.on('robotUpdateConfig', (...args) => this.robotUpdateConfig(...args));
    this.clientMessenger.on('robotWriteConfig', (...args) => this.robotWriteConfig(...args));
    this.clientMessenger.on('robotFreedriveEnable', (...args) =>
      this.robotFreedriveEnable(...args),
    );
    this.clientMessenger.on('robotFreedriveDisable', (...args) =>
      this.robotFreedriveDisable(...args),
    );
    this.clientMessenger.on('robotJointFreedriveEnable', (...args) =>
      this.robotJointFreedriveEnable(...args),
    );
  }

  /* -------------- Robot Shit -------------- */

  robotConnect(id, socket) {
    logger(`controller robot ${id} connected`);

    // Register that robot via its robot id
    this.robots[id] = {
      id: id,
      socketId: socket.id,
    };

    // Let the clients know of this new robot registration
    this.clientMessenger.send('robots', this.robots);
    this.clientMessenger.send('robotConnected', id);
  }

  robotDisconnect(id) {
    logger(`controller robot ${id} disconnected`);
    delete this.robots[id];
    this.clientMessenger.send('robots', this.robots);
    this.clientMessenger.send('robotDisconnected', id);
  }

  robotState(id, state) {
    logger(`controller robot state ${id}:`);
    this.clientMessenger.send('robot', id, state);
    if (this.websocket) this.websocket.send(state);
  }

  robotEncoder(id, state) {
    // Specifically dont log this because its a lot
    this.clientMessenger.send('robot', id, state);
    if (this.websocket) this.websocket.send(state);
  }

  robotRegister(id, robot) {
    logger(`controller robot register ${id}:`, robot);

    // Add meta to registered robot
    if (this.robots[id]) {
      this.robots[id] = {
        ...this.robots[id],
        ...robot,
      };
    }

    this.clientMessenger.send('robots', this.robots);
  }

  robotMoved(id, state) {
    logger(`controller robot moved ${id}:`);
    this.clientMessenger.send('robotMoved', id, state);
  }

  robotGrasped(id, state) {
    logger(`controller robot grasped ${id}:`);
    this.clientMessenger.send('robotGrasped', id, state);
  }

  pulse(id, pos) {
    // logger(`controller robot pulse id: ${id} pos: ${pos}`);
    this.clientMessenger.send('pulse', id, pos);
  }

  subscribeToRobotMessenger() {
    this.robotMessenger.on('connect', (...args) => this.robotConnect(...args));
    this.robotMessenger.on('disconnect', (...args) => this.robotDisconnect(...args));
    this.robotMessenger.on('state', (...args) => this.robotState(...args));
    this.robotMessenger.on('encoder', (...args) => this.robotEncoder(...args));
    this.robotMessenger.on('register', (...args) => this.robotRegister(...args));
    this.robotMessenger.on('moved', (...args) => this.robotMoved(...args));
    this.robotMessenger.on('grasped', (...args) => this.robotGrasped(...args));
    // this.robotMessenger.on('pulse', (...args) => this.pulse(...args));
  }

  /* -------------- Camera Shit -------------- */

  cameraData(data) {
    logger('data', data);
    this.clientMessenger.send('camera', data);
  }

  subscribeToCameraMessenger() {
    this.cameraMessenger.on('data', (...args) => this.cameraData(...args));
    // this.cameraMessenger.start();
  }
}
