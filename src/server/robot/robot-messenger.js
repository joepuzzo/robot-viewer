import { EventEmitter } from 'events';

import { Debug } from '../../lib/debug.js';
const logger = Debug('robot:robot-messenger' + '\t');

export class RobotMessenger extends EventEmitter {
  constructor(io) {
    logger('robot constructing MotorMessenger');
    super();
    // Create io with namespace robot
    this.io = io.of('/robot');
    // Initialize listeners
    this.io.on('connection', (socket) => this.connect(socket));
  }

  send(event, ...args) {
    // Send event via socket
    logger(`sending ${event}`, ...args);
    this.io.emit(event, ...args);
  }

  sendTo(id, event, ...args) {
    // Send event direct via socket
    logger(`sending ${event} to ${id}`, ...args);
    this.io.to(id).emit(event, ...args);
  }

  connect(socket) {
    // Get the id of the robot from the socket handshake
    const id = socket.handshake.query.id;
    // Get the key if there is one
    const key = socket.handshake.query.key;
    // Log connection
    logger(`robot with key ${key} and id ${id} connected`);
    // Publish connection event
    this.emit('connect', key, id, socket);

    // Subscribe to disconnect event
    socket.on('disconnect', (...args) => {
      logger(`robot ${id} disconnected`, args);
      this.emit('disconnect', key, id, args);
    });

    // Subscribe to any events from robot
    socket.onAny((eventName, ...args) => {
      // logger(`robot recived ${eventName} from robot ${id}`, args);
      this.emit(eventName, key, id, ...args);
    });
  }
}
