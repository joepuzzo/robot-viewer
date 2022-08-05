import { EventEmitter } from 'events';
import logger from 'winston';

export class MotorMessenger extends EventEmitter {
  constructor(io) {
    logger.info('constructing MotorMessenger');
    super();
    // Create io with namespace motor
    this.io = io.of('/motor');
    // this.io = io;
    // Initialize listeners
    this.io.on('connection', (socket) => this.connect(socket));
  }

  send(event, ...args) {
    // Send event via socket
    logger.info(`sending ${event}`, ...args);
    this.io.emit(event, ...args);
  }

  sendTo(id, event, ...args) {
    // Send event direct via socket
    logger.info(`sending ${event} to ${id}`, ...args);
    this.io.to(id).emit(event, ...args);
  }

  connect(socket) {
    // Get the id of the motor from the socket handshake
    const id = socket.handshake.query.id;
    // Log connection
    logger.info(`motor ${id} connected`);
    // Publish connection event
    this.emit('connect', id, socket);
    // Configure io handlers
    socket.on('hello', (...args) => this.hello(id, ...args));
    socket.on('disconnect', (...args) => this.disconnect(id, ...args));
    socket.on('state', (...args) => this.state(id, ...args));
  }

  state(id, state) {
    // Log state
    logger.info(`recived state from motor ${id}`, state);
    // Publish state event
    this.emit('state', id, state);
  }

  disconnect(id) {
    // Log disconnect
    logger.info(`motor ${id} disconnected`);
    // Publish disconnect event
    this.emit('disconnect', id);
  }

  hello(id) {
    // Log hello!
    logger.info(`bucket ${id} says hello`);
    // Publish hello event
    this.emit('hello', id);
  }
}
