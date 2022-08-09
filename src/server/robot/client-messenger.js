import { EventEmitter } from 'events';
import logger from 'winston';

export class ClientMessenger extends EventEmitter {
  constructor(io) {
    logger.info('client\t\t constructing ClientMessenger');
    super();
    // Create io with namespace client
    this.io = io.of('/client');
    // Initialize listeners
    this.io.on('connect', (socket) => this.connect(socket));
  }

  send(event, ...args) {
    // Send event via socket
    logger.info(`client\t\t sending ${event}`, ...args);
    this.io.emit(event, ...args);
  }

  sendTo(id, event, ...args) {
    // Send event direct via socket
    logger.info(`client\t\t sending ${event} to ${id}`, ...args);
    this.io.to(id).emit(event, ...args);
  }

  connect(socket) {
    // Log connection
    logger.info(`client\t\t connected`);
    // Publish connection event
    this.emit('connect', socket);

    // Subscribe to disconnect event
    socket.on('disconnect', (...args) => {
      logger.info(`client\t\t disconnected`, args);
      this.emit('disconnect', args);
    });

    // Subscribe to any events from motor
    socket.onAny((eventName, ...args) => {
      logger.info(`client\t\t recived ${eventName}`, args);
      this.emit(eventName, ...args);
    });
  }
}
