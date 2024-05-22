import { EventEmitter } from 'events';
import { Motor } from './motor.js';

// For reading and writing to config
import path from 'path';
import fs from 'fs';

// For debugging
import { Debug } from './debug.js';
const logger = Debug('mock:robot' + '\t');

export class Robot extends EventEmitter {
  /** ------------------------------
   * Constructor
   */
  constructor({ id }) {
    logger(`creating robot with id ${id}`);

    // Becasuse we are event emitter
    super();

    this.id = id; // id of the robot
    this.stopped = true; // if the robot is currently stopped
    this.ready = false; // if the robot is ready
    this.homing = false; // if the robot is currently homing
    this.moving = false; // if the robot is moving
    this.motorMap = {}; // tracks all motors by joint id
    this.motors = []; // array of all motors ( used for quick itteration )
    this.errors = []; // array of any errors that got triggered

    // Start up the robot when we are ready ( normally you would be connecting to some control interface and waiting here )
    setTimeout(() => {
      this.setup();
    }, 2000);
  }

  /** ------------------------------
   * setup
   */
  setup() {
    // First read in the config
    this.readConfig();

    logger(`starting robot with id ${this.id}`);

    // Create the motors
    this.motorMap.j0 = new Motor({ id: 'j0', ...this.config.j0 });
    this.motorMap.j1 = new Motor({ id: 'j1', ...this.config.j1 });
    this.motorMap.j2 = new Motor({ id: 'j2', ...this.config.j2 });
    this.motorMap.j3 = new Motor({ id: 'j3', ...this.config.j3 });
    this.motorMap.j4 = new Motor({ id: 'j4', ...this.config.j4 });
    this.motorMap.j5 = new Motor({ id: 'j5', ...this.config.j5 });

    // Set motors into array
    this.motors = Object.values(this.motorMap);

    // Subscribe to events for all motors
    this.motors.forEach((motor) => {
      motor.on('homing', () => this.robotState());
      motor.on('home', (id) => this.motorHomed(id));
      motor.on('disabled', () => this.robotState());
      motor.on('enabled', () => this.robotState());
      motor.on('moved', (id) => this.motorMoved(id));
      motor.on('reset', () => this.robotState());
    });

    // Create Gripper if you have a gripper

    // Report all encoder updates at 100ms interval
    setInterval(() => {
      this.robotEncoder(); // Will emit encoder event
    }, 100);

    this.ready = true;
    this.emit('ready');
  }

  /** ------------------------------
   * readConfig
   */
  readConfig() {
    // Read in config file ( create if it does not exist yet )
    try {
      // Get filename
      const filename = path.resolve('config.json');

      // Check if it exists and create if it does not
      if (!fs.existsSync(filename)) {
        console.log('Config file does not exist creating');
        fs.writeFileSync(
          filename,
          JSON.stringify({
            j0: { limNeg: -180, limPos: 180, homePos: 0 },
            j1: { limNeg: -140, limPos: 80, homePos: 0 },
            j2: { limNeg: -140, limPos: 80, homePos: 0 },
            j3: { limNeg: -180, limPos: 180, homePos: 0 },
            j4: { limNeg: -95, limPos: 95, homePos: 0 },
            j5: { limNeg: -180, limPos: 180, homePos: 0 },
          }),
        );
      }

      // Read in config file
      const config = JSON.parse(fs.readFileSync(filename, 'utf8'));

      logger('Successfully read in config', config);

      this.config = config;
    } catch (err) {
      console.error(err);
    }
  }

  /** ------------------------------
   * writeConfig
   */
  writeConfig() {
    logger('Writing config to file', this.config);
    try {
      // Get filename
      const filename = path.resolve('config.json');
      // Write config
      fs.writeFileSync(filename, JSON.stringify(this.config));
    } catch (err) {
      console.error(err);
    }
  }

  /** ------------------------------
   * updateConfig
   *
   * By default this will NOT save to the file it will only update in memory
   * Note: a call to writeConfig() at any time will save everything that has been updated to the file
   */
  updateConfig(key, value, save = false) {
    logger(`updating config ${key} to ${value}`);

    // Special check ( dont let user set a config param to null !! )
    if (value == null) {
      logger(`Unable to set ${key} to ${value} as its null`);
      return;
    }

    // Example key = "j0.limitAdj"
    if (key.includes('.')) {
      const [joint, param] = key.split('.');

      // Update the config
      this.config[joint][param] = value;

      // Update the motor
      this.motors[joint][param] = value;
    } else {
      this.config[key] = value;
    }

    // Now write the config out
    if (save) this.writeConfig();

    logger(`updated config`, this.config);

    this.emit('meta');
  }

  /** ------------------------------
   * get state
   */
  get state() {
    // Build motors state object
    const motors = {};
    this.motors.forEach((motor) => {
      motors[motor.id] = motor.state;
    });

    // return state
    return {
      id: this.id,
      motors,
    };
  }

  /** ------------------------------
   * get meta
   */
  get meta() {
    // Build motors meta object
    const motors = {};
    this.motors.forEach((motor) => {
      motors[motor.id] = { id: motor.id };
    });

    // return meta
    return {
      stopped: this.stopped,
      ready: this.ready,
      home: this.home,
      homing: this.homing,
      moving: this.moving,
      config: this.config,
      motors,
      errors: this.errors,
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
    if (enabled && this.stopped) {
      const message = `Please enable before ${log}`;
      logger(message);
      this.errors.push({ type: 'warning', message });
      this.emit('meta');
      return false;
    }
    // If action requires robot to have zero errors and we have errors then error out
    if (cleared && this.errors.length) {
      const message = `Please clear errors before ${log}`;
      logger(message);
      this.errors.push({ type: 'warning', message });
      this.emit('meta');
      return false;
    }
    return true;
  }

  /* -------------------- Motor Events -------------------- */

  motorHomed(id) {
    logger(`motor ${id} is homed`);

    // If we are homing robot check to see if we are all done homing
    if (this.homing) {
      if (this.motors.every((motor) => !motor.homing)) {
        logger(`all motors are home!`);
        this.homing = false;
      }
    }
    this.emit('meta');
    this.emit('state');
  }

  robotState() {
    this.emit('state');
  }

  robotEncoder() {
    this.emit('encoder');
  }

  motorMoved(id) {
    logger(`motor ${id} moved`);

    // If we are moving robot to a position check if its done
    if (this.moving) {
      if (this.motors.every((motor) => !motor.moving)) {
        logger(`all motors have moved!`);
        this.moving = false;
        this.emit('moved');
      }
    }

    // Let others know
    this.emit('meta');
    this.emit('state');
  }

  /* -------------------- Robot Actions -------------------- */

  robotHome() {
    logger(`home robot`);

    // Validate action
    if (!this.validate({ enabled: true, cleared: true, log: 'attempting to home' })) return;

    // Update our state
    this.homing = true;
    this.moving = true;

    // Because a motor might complete faster than all the others start we need to make sure we initialize all to homing + moving ;)
    this.motors.forEach((motor, i) => {
      motor.homing = true;
      motor.moving = true;
    });

    // Home all motors
    this.motors.forEach((motor, i) => {
      motor.goHome();
    });

    this.emit('meta');
  }

  robotCalibrate() {
    logger(`calibrate robot`);
  }

  robotSplitHome() {
    logger(`split home robot`);
  }

  robotStop() {
    logger(`stop robot`);

    this.stopped = true;

    // Disable all motors
    this.motors.forEach((motor) => {
      motor.disable();
    });

    this.emit('meta');
  }

  robotFreeze() {
    logger(`freeze robot`);

    // Freeze all motors ( stops but does not disable )
    this.motors.forEach((motor) => {
      motor.freeze();
    });

    this.emit('meta');
  }

  robotCenter() {
    logger(`center robot`);

    // We are moving whole robot
    this.moving = true;

    // Centers all motors
    this.motors.forEach((motor) => {
      motor.center();
    });

    this.emit('meta');
  }

  robotEnable() {
    logger(`enable robot`);

    this.stopped = false;

    // Enable all motors
    this.motors.forEach((motor) => {
      motor.enable();
    });

    this.emit('meta');
  }

  robotReset() {
    logger(`resetting robot errors`);

    // Reset all motors errors
    this.motors.forEach((motor) => {
      motor.resetErrors();
    });

    // Reset all robot errors
    this.errors = [];

    this.emit('meta');
  }

  robotSetAngles(angles, speed) {
    logger(`robotSetAngles at speed ${speed} angles:`, angles);

    // Validate action
    if (!this.validate({ enabled: true, cleared: true, log: 'attempting to move' })) return;

    // We are moving to a new location
    this.moving = true;

    // Because a motor might complete faster than all the others start we need to make sure we initialize all to moving ;)
    this.motors.forEach((motor, i) => {
      motor.moving = true;
    });

    // Step1: Determine travelSpeed and acceleration
    // Normally this involves complex math to ensure all motors start / stop at same time
    const travelSpeed = speed;
    const acceleration = speed;

    // Step2: Move via speed for each based on time
    this.motors.forEach((motor, i) => {
      logger(`setting angle for motor ${motor.id} at speed ${speed} and angle:`, angles[i]);
      motor.setPosition(angles[i], travelSpeed, acceleration);
    });

    this.emit('meta');
  }

  /* -------------------- Motor Actions -------------------- */

  motorSetPosition(id, pos, speed) {
    logger(`set position for motor ${id}`);

    // Skip if the motor is disabled
    if (!this.motorMap[id].enabled) {
      logger(`Not moving motor ${id}, please enable before attempting to move`);
      return;
    }

    this.motorMap[id].setPosition(pos, speed);
  }

  motorHome(id) {
    logger(`home motor ${id}`);
    this.motorMap[id].goHome();
  }

  motorResetErrors(id) {
    logger(`reset motor errors for motor ${id}`);
    this.motorMap[id].resetErrors();
  }

  motorEnable(id) {
    logger(`enable motor ${id}`);
    this.motorMap[id].enable();
  }

  motorDisable(id) {
    logger(`enable motor ${id}`);
    this.motorMap[id].disable();
  }

  motorZero(id) {
    logger(`zero motor ${id}`);
    this.motorMap[id].zero();
  }

  /* -------------------- Gripper Actions -------------------- */

  gripperSetPosition(pos, speed = 500) {
    logger(`set position for gripper to ${pos}, at speed ${speed}`);
  }
}
