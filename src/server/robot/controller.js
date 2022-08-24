import { RobotMessenger } from './robot-messenger.js';
import { ClientMessenger } from './client-messenger.js';

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
    // Bind to bucket events
    this.subscribeToRobotMessenger();
    // Bind to client events
    this.subscribeToClientMessenger();
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

  subscribeToClientMessenger() {
    this.clientMessenger.on('hello', (...args) => this.clientHello(...args));
    this.clientMessenger.on('connect', (...args) => this.clientConnect(...args));
    this.clientMessenger.on('disconnect', (...args) => this.clientDisconnect(...args));
    this.clientMessenger.on('motorSetPos', (...args) => this.motorSetPos(...args));
    this.clientMessenger.on('motorResetErrors', (...args) => this.motorResetErrors(...args));
    this.clientMessenger.on('motorEnable', (...args) => this.motorEnable(...args));
    this.clientMessenger.on('motorHome', (...args) => this.motorHome(...args));
    this.clientMessenger.on('robotHome', (...args) => this.robotHome(...args));
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
    this.clientMessenger.send('robot', state);
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

  subscribeToRobotMessenger() {
    this.robotMessenger.on('connect', (...args) => this.robotConnect(...args));
    this.robotMessenger.on('disconnect', (...args) => this.robotDisconnect(...args));
    this.robotMessenger.on('state', (...args) => this.robotState(...args));
    this.robotMessenger.on('register', (...args) => this.robotRegister(...args));
  }
}
