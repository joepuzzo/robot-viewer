import { EventEmitter } from 'events';
import axios from 'axios';

import { Debug } from '../../lib/debug.js';
const logger = Debug('robot:camera-messenger' + '\t');

export class CameraMessenger extends EventEmitter {
  constructor(io) {
    logger('robot constructing CameraMessenger');
    super();
    // Start polling for camera data
  }

  start() {
    setInterval(() => {
      this.fetchCameraData();
    }, 3000);
  }

  async fetchCameraData() {
    try {
      const response = await axios.get('http://localhost:3000/camera');
      const data = response.data;
      //   logger('Data', data);
      this.emit('data', data);
    } catch (error) {
      logger('Error', err);
    }
  }
}
