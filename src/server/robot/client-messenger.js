import { EventEmitter } from 'events';

import { Debug } from '../../lib/debug.js';
const logger = Debug('robot:client-messenger' + '\t');
export class ClientMessenger extends EventEmitter {
  constructor(io) {
    logger('client constructing ClientMessenger');
    super();
    // Create io with namespace client
    this.io = io.of('/client');
    // Initialize listeners
    this.io.on('connect', (socket) => this.connect(socket));
  }

  send(event, ...args) {
    // Send event via socket
    // logger(`client sending ${event}`, ...args);
    this.io.emit(event, ...args);
  }

  sendTo(id, event, ...args) {
    // Send event direct via socket
    logger(`client sending ${event} to ${id}`, ...args);
    this.io.to(id).emit(event, ...args);
  }

  connect(socket) {
    // Log connection
    logger(`client connected`);
    // Publish connection event
    this.emit('connect', socket);

    // Subscribe to disconnect event
    socket.on('disconnect', (...args) => {
      logger(`client disconnected`, args);
      this.emit('disconnect', args);
    });

    // Subscribe to any events from motor
    socket.onAny((eventName, ...args) => {
      logger(`client recived ${eventName}`, args);
      this.emit(eventName, ...args);
    });
  }
}
