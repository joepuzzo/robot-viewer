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

  clientConnect(key, socket) {
    logger(`controller client with key ${key} connected`);
    // Add this connection to a room
    socket.join(key);
    // Send message to that room
    this.clientMessenger.sendTo(key, 'robots', this.robots[key] || {});
  }

  clientDisconnect(key) {
    logger(`controller client with key ${key} disconnected`);
  }

  clientHello(...args) {
    logger(`controller client says hello`, args);
  }

  gripperSetPos(key, robotId, pos, speed, force, wait) {
    logger(`controller client says gripperSetPos`, robotId, pos, speed, force, wait);
    // only send if we are connected
    if (this.robots[key][robotId]) {
      const socketId = this.robots[key][robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'gripperSetPos', pos, speed, force, wait);
    }
  }

  motorSetPos(key, robotId, motorId, pos) {
    logger(`controller client says motorSetPos`, robotId, motorId, pos);
    // only send if we are connected
    if (this.robots[key][robotId]) {
      const socketId = this.robots[key][robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'motorSetPos', motorId, pos);
    }
  }

  motorResetErrors(key, robotId, motorId) {
    logger(`controller client says motorResetErrors`, robotId, motorId);
    // only send if we are connected
    if (this.robots[key][robotId]) {
      const socketId = this.robots[key][robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'motorResetErrors', motorId);
    }
  }

  motorEnable(key, robotId, motorId) {
    logger(`controller client says motorEnable`, robotId, motorId);
    // only send if we are connected
    if (this.robots[key][robotId]) {
      const socketId = this.robots[key][robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'motorEnable', motorId);
    }
  }

  motorDisable(key, robotId, motorId) {
    logger(`controller client says motorDisable`, robotId, motorId);
    // only send if we are connected
    if (this.robots[key][robotId]) {
      const socketId = this.robots[key][robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'motorDisable', motorId);
    }
  }

  queryMotorPosition(key, robotId, motorId) {
    logger(`controller client says queryMotorPosition`, robotId, motorId);
    // only send if we are connected
    if (this.robots[key][robotId]) {
      const socketId = this.robots[key][robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'queryMotorPosition', motorId);
    }
  }

  queryMotorParameter(key, robotId, motorId, index, subindex) {
    logger(`controller client says queryMotorParameter`, robotId, motorId, index, subindex);
    // only send if we are connected
    if (this.robots[key][robotId]) {
      const socketId = this.robots[key][robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'queryMotorParameter', motorId, index, subindex);
    }
  }

  motorCalibrate(key, robotId, motorId) {
    logger(`controller client says motorCalibrate`, robotId, motorId);
    // only send if we are connected
    if (this.robots[key][robotId]) {
      const socketId = this.robots[key][robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'motorCalibrate', motorId);
    }
  }

  motorReference(key, robotId, motorId) {
    logger(`controller client says motorReference`, robotId, motorId);
    // only send if we are connected
    if (this.robots[key][robotId]) {
      const socketId = this.robots[key][robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'motorReference', motorId);
    }
  }

  robotReference(key, robotId) {
    logger(`controller client says robotReference`, robotId);
    // only send if we are connected
    if (this.robots[key][robotId]) {
      const socketId = this.robots[key][robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'robotReference');
    }
  }

  robotZero(key, robotId) {
    logger(`controller client says robotZero`, robotId);
    // only send if we are connected
    if (this.robots[key][robotId]) {
      const socketId = this.robots[key][robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'robotZero');
    }
  }

  robotZeroFT(key, robotId) {
    logger(`controller client says robotZeroFT`, robotId);
    // only send if we are connected
    if (this.robots[key][robotId]) {
      const socketId = this.robots[key][robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'robotZeroFT');
    }
  }

  motorZero(key, robotId, motorId) {
    logger(`controller client says motorZero`, robotId, motorId);
    // only send if we are connected
    if (this.robots[key][robotId]) {
      const socketId = this.robots[key][robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'motorZero', motorId);
    }
  }

  motorHome(key, robotId, motorId) {
    logger(`controller client says motorHome`, robotId, motorId);
    // only send if we are connected
    if (this.robots[key][robotId]) {
      const socketId = this.robots[key][robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'motorHome', motorId);
    }
  }

  robotHome(key, robotId) {
    logger(`controller client says robotHome`, robotId);
    // only send if we are connected
    if (this.robots[key][robotId]) {
      const socketId = this.robots[key][robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'robotHome');
    }
  }

  robotCalibrate(key, robotId) {
    logger(`controller client says robotCalibrate`, robotId);
    // only send if we are connected
    if (this.robots[key][robotId]) {
      const socketId = this.robots[key][robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'robotCalibrate');
    }
  }

  robotResetErrors(key, robotId) {
    logger(`controller client says robotResetErrors`, robotId);
    // only send if we are connected
    if (this.robots[key][robotId]) {
      const socketId = this.robots[key][robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'robotResetErrors');
    }
  }

  robotAccelEnabled(key, robotId, value) {
    logger(`controller client says robotAccelEnabled`, robotId, value);
    // only send if we are connected
    if (this.robots[key][robotId]) {
      const socketId = this.robots[key][robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'robotAccelEnabled', value);
    }
  }

  robotFreedriveEnable(key, robotId, freedriveFrame, cartFloatingAxis, nullspace) {
    logger(
      `controller client says robotFreedriveEnable`,
      robotId,
      freedriveFrame,
      cartFloatingAxis,
      nullspace,
    );
    // only send if we are connected
    if (this.robots[key][robotId]) {
      const socketId = this.robots[key][robotId].socketId;
      this.robotMessenger.sendTo(
        socketId,
        'robotFreedriveEnable',
        freedriveFrame,
        cartFloatingAxis,
        nullspace,
      );
    }
  }

  robotJointFreedriveEnable(key, robotId, joints) {
    logger(`controller client says robotJointFreedriveEnable`, robotId, joints);
    // only send if we are connected
    if (this.robots[key][robotId]) {
      const socketId = this.robots[key][robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'robotJointFreedriveEnable', joints);
    }
  }

  robotFreedriveDisable(key, robotId) {
    logger(`controller client says robotFreedriveDisable`, robotId);
    // only send if we are connected
    if (this.robots[key][robotId]) {
      const socketId = this.robots[key][robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'robotFreedriveDisable');
    }
  }

  robotSplitHome(key, robotId) {
    logger(`controller client says robotSplitHome`, robotId);
    // only send if we are connected
    if (this.robots[key][robotId]) {
      const socketId = this.robots[key][robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'robotSplitHome');
    }
  }

  robotStop(key, robotId) {
    logger(`controller client says robotStop`, robotId);
    // only send if we are connected
    if (this.robots[key][robotId]) {
      const socketId = this.robots[key][robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'robotStop');
    }
  }

  robotMode(key, robotId, mode) {
    logger(`controller client says robotMode`, robotId, mode);
    // only send if we are connected
    if (this.robots[key][robotId]) {
      const socketId = this.robots[key][robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'robotMode', mode);
    }
  }

  robotRunPlan(key, robotId, name) {
    logger(`controller client says robotRunPlan`, robotId, name);
    // only send if we are connected
    if (this.robots[key][robotId]) {
      const socketId = this.robots[key][robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'robotRunPlan', name);
    }
  }

  robotRunActions(key, robotId, actions) {
    logger(`controller client says robotRunActions`, robotId, actions);
    // only send if we are connected
    if (this.robots[key][robotId]) {
      const socketId = this.robots[key][robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'robotRunActions', actions);
    }
  }

  robotAverageRead(key, robotId, actions) {
    logger(`controller client says robotAverageRead`, robotId);
    // only send if we are connected
    if (this.robots[key][robotId]) {
      const socketId = this.robots[key][robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'robotAverageRead');
    }
  }

  robotFreeze(key, robotId) {
    logger(`controller client says robotFreeze`, robotId);
    // only send if we are connected
    if (this.robots[key][robotId]) {
      const socketId = this.robots[key][robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'robotFreeze');
    }
  }

  robotCenter(key, robotId) {
    logger(`controller client says robotCenter`, robotId);
    // only send if we are connected
    if (this.robots[key][robotId]) {
      const socketId = this.robots[key][robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'robotCenter');
    }
  }

  robotUpdateConfig(key, robotId, field, value) {
    logger(`controller client says update ${field} to ${value} for robot ${robotId}`);
    // only send if we are connected
    if (this.robots[key][robotId]) {
      const socketId = this.robots[key][robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'robotUpdateConfig', field, value);
    }
  }

  robotWriteConfig(key, robotId) {
    logger(`controller client says write config for robot ${robotId}`);
    // only send if we are connected
    if (this.robots[key][robotId]) {
      const socketId = this.robots[key][robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'robotWriteConfig');
    }
  }

  robotEnable(key, robotId) {
    logger(`controller client says robotEnable`, robotId);
    // only send if we are connected
    if (this.robots[key][robotId]) {
      const socketId = this.robots[key][robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'robotEnable');
    }
  }

  robotSetAngles(key, robotId, angles, speed, idle) {
    logger(`controller client says robotSetAngles`, robotId);
    // only send if we are connected
    if (this.robots[key][robotId]) {
      const socketId = this.robots[key][robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'robotSetAngles', angles, speed, idle);
    }
  }

  robotMoveL(key, robotId, parameters) {
    logger(`controller client says robotMoveL ${robotId} with parameters ${parameters}`);
    // only send if we are connected
    if (this.robots[key][robotId]) {
      const socketId = this.robots[key][robotId].socketId;
      this.robotMessenger.sendTo(socketId, 'robotMoveL', parameters);
    }
  }

  robotMoveContact(key, robotId, parameters) {
    logger(`controller client says robotMoveContact ${robotId} with parameters ${parameters}`);
    // only send if we are connected
    if (this.robots[key][robotId]) {
      const socketId = this.robots[key][robotId].socketId;
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
    this.clientMessenger.on('robotMode', (...args) => this.robotMode(...args));
    this.clientMessenger.on('robotRunPlan', (...args) => this.robotRunPlan(...args));
    this.clientMessenger.on('robotRunActions', (...args) => this.robotRunActions(...args));
    this.clientMessenger.on('robotFreeze', (...args) => this.robotFreeze(...args));
    this.clientMessenger.on('robotCenter', (...args) => this.robotCenter(...args));
    this.clientMessenger.on('robotEnable', (...args) => this.robotEnable(...args));
    this.clientMessenger.on('robotSetAngles', (...args) => this.robotSetAngles(...args));
    this.clientMessenger.on('robotMoveL', (...args) => this.robotMoveL(...args));
    this.clientMessenger.on('robotMoveContact', (...args) => this.robotMoveContact(...args));
    this.clientMessenger.on('robotUpdateConfig', (...args) => this.robotUpdateConfig(...args));
    this.clientMessenger.on('robotWriteConfig', (...args) => this.robotWriteConfig(...args));
    this.clientMessenger.on('robotAverageRead', (...args) => this.robotAverageRead(...args));
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

  robotConnect(key, id, socket) {
    logger(`robot with key ${key} and id ${id} connected`);

    // Initialize the key if it does not exist
    if (!this.robots[key]) {
      this.robots[key] = {};
    }

    // Register that robot via its robot id
    this.robots[key][id] = {
      id: id,
      key: key,
      socketId: socket.id,
    };

    // Let the clients know of this new robot registration
    this.clientMessenger.sendTo(key, 'robots', this.robots[key]);
    this.clientMessenger.sendTo(key, 'robotConnected', id);
  }

  robotDisconnect(key, id) {
    logger(`controller robot ${id} disconnected`);
    const robots = this.robots[key];
    delete robots[id];
    // Determine which robots to send to client based on key
    this.clientMessenger.sendTo(key, 'robots', this.robots[key]);
    this.clientMessenger.sendTo(key, 'robotDisconnected', id);
  }

  robotState(key, id, state) {
    logger(`controller robot state ${id}:`);
    this.clientMessenger.sendTo(key, 'robot', id, state);
    if (this.websocket) this.websocket.send(state);
  }

  robotEncoder(key, id, state) {
    // Specifically dont log this because its a lot
    this.clientMessenger.sendTo(key, 'robot', id, state);
    if (this.websocket) this.websocket.send(state);
  }

  robotRegister(key, id, robot) {
    logger(`controller robot register ${id}:`, robot);

    // Add meta to registered robot
    if (this.robots[key][id]) {
      this.robots[key][id] = {
        ...this.robots[key][id],
        ...robot,
      };
    }

    this.clientMessenger.sendTo(key, 'robots', this.robots[key]);
  }

  robotMoved(key, id, state) {
    logger(`controller robot moved ${id}:`);
    this.clientMessenger.sendTo(key, 'robotMoved', id, state);
  }

  robotGrasped(key, id, state) {
    logger(`controller robot grasped ${id}:`);
    this.clientMessenger.sendTo(key, 'robotGrasped', id, state);
  }

  robotZeroedFT(key, id, state) {
    logger(`controller robot zeroedFT ${id}:`);
    this.clientMessenger.sendTo(key, 'robotZeroedFT', id, state);
  }

  robotModeChange(key, id, mode) {
    logger(`controller robot mode ${id}:`);
    this.clientMessenger.sendTo(key, 'robotModeChange', id, mode);
  }

  // For Single action

  robotActionStart(key, id, name) {
    logger(`controller robot action start ${id}:`);
    this.clientMessenger.sendTo(key, 'robotActionStart', id, name);
  }

  robotActionComplete(key, id, name) {
    logger(`controller robot action complete ${id}:`);
    this.clientMessenger.sendTo(key, 'robotActionComplete', id, name);
  }

  // For Multiple actions

  robotActionsStart(key, id, name) {
    logger(`controller robot actions start ${id}:`);
    this.clientMessenger.sendTo(key, 'robotActionsStart', id, name);
  }

  robotActionsComplete(key, id, name) {
    logger(`controller robot actions complete ${id}:`);
    this.clientMessenger.sendTo(key, 'robotActionsComplete', id, name);
  }

  robotAverageReadComplete(key, id, name) {
    logger(`controller robot average read complete ${id}:`);
    this.clientMessenger.sendTo(key, 'robotAverageReadComplete', id);
  }

  pulse(key, id, pos) {
    // logger(`controller robot pulse id: ${id} pos: ${pos}`);
    this.clientMessenger.sendTo(key, 'pulse', id, pos);
  }

  subscribeToRobotMessenger() {
    this.robotMessenger.on('connect', (...args) => this.robotConnect(...args));
    this.robotMessenger.on('disconnect', (...args) => this.robotDisconnect(...args));
    this.robotMessenger.on('state', (...args) => this.robotState(...args));
    this.robotMessenger.on('encoder', (...args) => this.robotEncoder(...args));
    this.robotMessenger.on('register', (...args) => this.robotRegister(...args));
    this.robotMessenger.on('moved', (...args) => this.robotMoved(...args));
    this.robotMessenger.on('grasped', (...args) => this.robotGrasped(...args));
    this.robotMessenger.on('zeroedFT', (...args) => this.robotZeroedFT(...args));
    this.robotMessenger.on('mode', (...args) => this.robotModeChange(...args));
    // For single Action
    this.robotMessenger.on('actionStart', (...args) => this.robotActionStart(...args));
    this.robotMessenger.on('actionComplete', (...args) => this.robotActionComplete(...args));
    // For multiple Actions
    this.robotMessenger.on('actionsStart', (...args) => this.robotActionsStart(...args));
    this.robotMessenger.on('actionsComplete', (...args) => this.robotActionsComplete(...args));
    this.robotMessenger.on('averageReadComplete', (...args) =>
      this.robotAverageReadComplete(...args),
    );
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
