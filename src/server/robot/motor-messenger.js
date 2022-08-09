import { EventEmitter } from 'events';
import logger from 'winston';

export class MotorMessenger extends EventEmitter {
  constructor(io) {
    logger.info('motor\t\t constructing MotorMessenger');
    super();
    // Create io with namespace motor
    this.io = io.of('/motor');
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
    logger.info(`motor\t\t ${id} connected`);
    // Publish connection event
    this.emit('connect', id, socket);

    // Subscribe to disconnect event
    socket.on('disconnect', (...args) => {
      logger.info(`motor\t\t ${id} disconnected`, args);
      this.emit('disconnect', id, args);
    });

    // Subscribe to any events from motor
    socket.onAny((eventName, ...args) => {
      logger.info(`motor\t\t recived ${eventName} from motor ${id}`, args);
      this.emit(eventName, id, ...args);
    });
  }
}
