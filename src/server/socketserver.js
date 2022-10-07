import stuff from 'websocket';
import http from 'http';

// https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
export const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const WebSocketServer = stuff.server;

const connections = {};

const startWebsocket = () => {
  // Create server for websockets
  const webSocketServer = http.createServer();

  // Start server
  webSocketServer.listen(6900, () => {
    console.log('Websocket Server is now running on port', 6900);
  });

  // Add websocket for pub to metrics
  const wsServer = new WebSocketServer({
    httpServer: webSocketServer,
    autoAcceptConnections: true,
  });

  wsServer.on('connect', (socket) => {
    socket.id = uuidv4();
    connections[socket.id] = socket;

    console.log(`Client connected ID: ${socket.id}`);

    socket.on('close', () => {
      delete connections[socket.id];
      delete socket.id;
    });
  });

  // For testing
  // setInterval(() => {
  //   Object.values(connections).forEach((connection) => {
  //     console.log('SEND');
  //     connection.send(JSON.stringify({ event: 'notify', payload: 'Hello specific client' }));
  //   });
  // }, 1000);

  return {
    send: (payload) => {
      Object.values(connections).forEach((connection) => {
        connection.send(JSON.stringify(payload));
      });
    },
  };
};

export default startWebsocket;
