import { EventEmitter } from 'events';
import logger from 'winston';

export class ClientMessenger extends EventEmitter {
  constructor(io) {
    logger.info('constructing ClientMessenger');
    super();
    // Create io with namespace client
    this.io = io.of('/client');
    // Initialize listeners
    this.io.on('connect', (socket) => this.connect(socket));
  }

  send(event, ...args) {
    // Send event via socket
    logger.info(`client sending ${event}`, ...args);
    this.io.emit(event, ...args);
  }

  sendTo(id, event, ...args) {
    // Send event direct via socket
    logger.info(`client sending ${event} to ${id}`, ...args);
    this.io.to(id).emit(event, ...args);
  }

  connect(socket) {
    // Log connection
    logger.info('client connected');
    // Publish connection event
    this.emit('connect', client);
    // Configure io handlers
    socket.on('hello', (...args) => this.hello(...args));
    socket.on('disconnect', (...args) => this.disconnect(...args));
  }

  disconnect() {
    // Log disconnect
    logger.info('client disconnected');
    // Publish disconnect event
    this.emit('disconnect');
  }

  hello() {
    // Log hello!
    logger.info('client says hello');
    // Publish hello event
    this.emit('hello');
  }
}
