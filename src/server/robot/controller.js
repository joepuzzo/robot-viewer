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

  subscribeToClientMessenger() {
    this.clientMessenger.on('hello', (...args) => this.clientHello(...args));
    this.clientMessenger.on('connect', (...args) => this.clientConnect(...args));
    this.clientMessenger.on('disconnect', (...args) => this.clientDisconnect(...args));
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
  }

  robotDisconnect(id) {
    logger(`controller robot ${id} disconnected`);
    delete this.robots[id];
    this.clientMessenger.send('robots', this.robots);
  }

  robotState(id, state) {
    logger(`controller robot state ${id}:`, state);
    this.clientMessenger.send('robot', state);
  }

  subscribeToRobotMessenger() {
    this.robotMessenger.on('connect', (...args) => this.robotConnect(...args));
    this.robotMessenger.on('disconnect', (...args) => this.robotDisconnect(...args));
    this.robotMessenger.on('state', (...args) => this.robotState(...args));
  }
}