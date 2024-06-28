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
    // logger(`client sending ${event} to ${id}`, ...args);
    this.io.to(id).emit(event, ...args);
  }

  connect(socket) {
    // Get the key if there is one
    const key = socket.handshake.query.key;
    // Log connection
    logger(`client with key ${key} connected`);
    // Publish connection event
    this.emit('connect', key, socket);

    // Subscribe to disconnect event
    socket.on('disconnect', (...args) => {
      logger(`client disconnected`, key, args);
      this.emit('disconnect', key, socket, args);
    });

    // Subscribe to any events from client
    socket.onAny((eventName, ...args) => {
      logger(`client recived ${eventName} on key ${key}`, args);
      this.emit(eventName, key, ...args);
    });
  }
}
