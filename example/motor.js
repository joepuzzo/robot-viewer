import { EventEmitter } from 'events';

// For debugging
import { Debug } from './debug.js';
const logger = Debug('mock:motor' + '\t');

export class Motor extends EventEmitter {
  constructor({ id, homePos, maxSpeed = 40, maxAccel = 20 }) {
    super();
    this.id = id;
    this.homePos = homePos;
    this.maxSpeed = maxSpeed;
    this.maxAccel = maxAccel;
    this.currentPos = homePos;
    this.goalPos = homePos;
    this.moving = false;
    this.homing = false;
    this.enabled = false;
    logger(`Motor ${this.id} created with homePos ${this.homePos}`);
  }

  get state() {
    return {
      id: this.id,
      homing: this.homing,
      home: this.home,
      enabled: this.enabled,
      error: this.error,
      moving: this.moving,
      currentPos: this.currentPos,
      goalPos: this.goalPos,
    };
  }

  /** ------------------------------
   * validate
   *
   * validates to make sure action is ok based on parameters passed
   *
   * Example validate({ enabled: true, cleared: true, message: 'attempting to move '})
   * will prevent the action if the robot is not enabled and cleared of any errors
   */
  validate({ enabled, cleared, log }) {
    // If action requires robot to be enabled and we are not then error out
    if (enabled && !this.enabled) {
      const message = `Please enable before ${log}`;
      logger(message);
      this.error = 'DISABLED';
      this.emit('meta');
      return false;
    }
    // If action requires robot to have zero errors and we have errors then error out
    if (cleared && this.error) {
      const message = `Please clear error before ${log}`;
      logger(message);
      this.error = 'CLEAR_ERROR';
      this.emit('meta');
      return false;
    }
    return true;
  }

  setPosition(position, spd, acc) {
    const speed = spd || this.maxSpeed;
    const acceleration = acc || this.maxAccel;

    // Validate action
    if (!this.validate({ enabled: true, cleared: true, log: 'attempting to set position' })) return;

    logger(
      `Motor ${this.id} setPosition called with position ${position}, speed ${speed}, acceleration ${acceleration}`,
    );
    this.goalPos = position;
    this.moving = true;

    const distance = Math.abs(this.goalPos - this.currentPos);
    const direction = this.goalPos > this.currentPos ? 1 : -1;
    const interval = 100; // Update every 100 ms
    const step = ((speed * interval) / 1000) * direction; // Degrees per interval

    logger(`Motor ${this.id} will be moving in steps of ${step}`);

    const move = () => {
      if (this.moving) {
        // Check if the motor has reached its goal position
        // logger(`Motor ${this.id} difference is ${Math.abs(this.goalPos - this.currentPos)}`);
        if (Math.abs(this.goalPos - this.currentPos) < Math.abs(step)) {
          this.currentPos = this.goalPos;
          this.moving = false;
          logger(`Motor ${this.id} reached goal position ${this.goalPos}`);
          this.emit('moved', this.id);
          this.emit('pulse', this.id, this.currentPos);
          // Maybe we were homing the robot so update homing
          if (this.homing) {
            this.homing = false;
            logger(`Motor ${this.id} finished homing`);
            this.emit('home', this.id);
          }
        }
        // Check if the motor has been disabled ( occurs on manual disable or robot stop )
        else if (!this.enabled) {
          logger(
            `Motor ${this.id} was moving to ${this.goalPos} but was stoped at ${this.currentPos}`,
          );
          this.goalPos = this.currentPos;
          this.moving = false;
          this.homing = false;
          this.emit('moved', this.id);
          this.emit('pulse', this.id, this.currentPos);
        }
        // Keep going :)
        else {
          this.currentPos = this.currentPos + step;
          //   logger(`Motor ${this.id} moving to ${this.currentPos}`);
          this.emit('pulse', this.id, this.currentPos);
          setTimeout(move, interval);
        }
      }
    };

    move();
  }

  goHome() {
    logger(`Motor ${this.id} going home to ${this.homePos}`);

    // Validate action
    if (!this.validate({ enabled: true, cleared: true, log: 'attempting to home' })) return;

    this.homing = true;
    this.setPosition(this.homePos);
  }

  resetErrors() {
    logger(`Motor ${this.id} resetting errors`);
    this.error = null;
    this.emit('reset');
  }

  enable() {
    logger(`Motor ${this.id} enabled`);
    this.enabled = true;
    this.emit('enabled');
  }

  disable() {
    logger(`Motor ${this.id} disabled`);
    this.enabled = false;
    this.emit('disabled');
  }

  freeze() {
    logger(`Motor ${this.id} freeze called`);
    this.moving = false;
    this.emit('freeze');
  }

  center() {
    logger(`Motor ${this.id} centering`);
    this.setPosition(0);
  }

  zero() {
    logger(`Motor ${this.id} zeroing position`);
    this.currentPos = 0;
    this.goalPos = 0;
    this.emit('reset');
  }

  startHoming() {
    logger(`Motor ${this.id} starting homing`);
    this.emit('homing');
    this.goHome();
  }
}

export default Motor;
