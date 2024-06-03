import json
import threading
from pathlib import Path
from pyee import EventEmitter
from motor import Motor
from debug import Debug

logger = Debug('mock:robot\t')


class Robot(EventEmitter):
    def __init__(self, config):
        logger(f'Creating robot with id {config["id"]}')

        # Because we are event emitter
        super().__init__()

        self.id = config['id']  # id of the robot
        self.stopped = True  # if the robot is currently stopped
        self.ready = False  # if the robot is ready
        self.homing = False  # if the robot is currently homing
        self.home = False  # if the robot is home
        self.moving = False  # if the robot is moving
        self.freedrive = False  # if the robot is currently in freedrive
        self.motor_map = {}  # tracks all motors by joint id
        self.motors = []  # array of all motors (used for quick iteration)
        self.errors = []  # array of any errors that got triggered

        # Start up the robot when we are ready (normally you would be connecting to some control interface and waiting here)
        threading.Timer(2.0, self.setup).start()

    def setup(self):
        # First read in the config
        self.read_config()

        logger(f'Starting robot with id {self.id}')

        # Create the motors
        self.motor_map['j0'] = Motor(id='j0', **self.config['j0'])
        self.motor_map['j1'] = Motor(id='j1', **self.config['j1'])
        self.motor_map['j2'] = Motor(id='j2', **self.config['j2'])
        self.motor_map['j3'] = Motor(id='j3', **self.config['j3'])
        self.motor_map['j4'] = Motor(id='j4', **self.config['j4'])
        self.motor_map['j5'] = Motor(id='j5', **self.config['j5'])
        self.motor_map['j6'] = Motor(id='j6', **self.config['j6'])

        # Set motors into array
        self.motors = list(self.motor_map.values())

        # Subscribe to events for all motors
        for motor in self.motors:
            motor.on('homing', self.robot_state)
            motor.on('home', self.motor_homed)
            motor.on('disabled', self.robot_state)
            motor.on('freeze', self.robot_state)
            motor.on('enabled', self.robot_state)
            motor.on('moved', self.motor_moved)
            motor.on('reset', self.robot_state)

        # Create Gripper if you have a gripper

        # Report all encoder updates at 100ms interval
        self.encoder_timer = threading.Timer(0.1, self.robot_encoder)
        self.encoder_timer.start()

        self.ready = True
        self.emit('ready')

    def read_config(self):
        # Read in config file (create if it does not exist yet)
        try:
            # Get filename
            filename = Path('config.json')

            # Check if it exists and create if it does not
            if not filename.exists():
                logger('Config file does not exist, creating')
                with open(filename, 'w') as f:
                    json.dump({
                        'j0': {'limNeg': -180, 'limPos': 180, 'homePos': 0},
                        'j1': {'limNeg': -140, 'limPos': 80, 'homePos': 0},
                        'j2': {'limNeg': -140, 'limPos': 80, 'homePos': 0},
                        'j3': {'limNeg': -180, 'limPos': 180, 'homePos': 0},
                        'j4': {'limNeg': -95, 'limPos': 95, 'homePos': 0},
                        'j5': {'limNeg': -180, 'limPos': 180, 'homePos': 0}
                    }, f)

            # Read in config file
            with open(filename, 'r') as f:
                self.config = json.load(f)

            logger('Successfully read in config', self.config)
        except Exception as e:
            logger(f'Error reading config: {e}')

    def write_config(self):
        logger('Writing config to file', self.config)
        try:
            # Get filename
            filename = Path('config.json')
            # Write config
            with open(filename, 'w') as f:
                json.dump(self.config, f)
        except Exception as e:
            logger(f'Error writing config: {e}')

    def update_config(self, key, value, save=False):
        logger(f'Updating config {key} to {value}')

        # Special check (don't let user set a config param to null!!)
        if value is None:
            logger(f'Unable to set {key} to {value} as it is null')
            return

        # Example key = "j0.limitAdj"
        if '.' in key:
            joint, param = key.split('.')
            # Update the config
            self.config[joint][param] = value
            # Update the motor
            self.motor_map[joint][param] = value
        else:
            self.config[key] = value

        # Now write the config out
        if save:
            self.write_config()

        logger('Updated config', self.config)
        self.emit('meta')

    @property
    def state(self):
        # Build motors state object
        motors = {motor.id: motor.state for motor in self.motors}
        return {
            'id': self.id,
            'motors': motors,
            'tcpPose': [0, 0, 0, 0, 0, 0]
        }

    @property
    def busy(self):
        # Return true if we are busy doing anything
        return self.homing or self.moving

    @property
    def meta(self):
        # Build motors meta object
        motors = {motor.id: {'id': motor.id} for motor in self.motors}
        return {
            'stopped': self.stopped,
            'ready': self.ready,
            'home': self.home,
            'homing': self.homing,
            'moving': self.moving,
            'config': self.config,
            'motors': motors,
            'errors': self.errors,
            'freedrive': self.freedrive,
            'busy': self.busy,
        }

    def validate(self, enabled=False, cleared=False, log=''):
        # If action requires robot to be enabled and we are not then error out
        if enabled and self.stopped:
            message = f'Enable before {log}'
            logger(message)
            self.errors.append({'type': 'warning', 'message': message})
            self.emit('meta')
            return False
        # If action requires robot to have zero errors and we have errors then error out
        if cleared and self.errors:
            message = f'Clear errors before {log}'
            logger(message)
            self.errors.append({'type': 'warning', 'message': message})
            self.emit('meta')
            return False
        return True

    def motor_homed(self, id):
        logger(f'Motor {id} is homed')
        # If we are homing robot check to see if we are all done homing
        if self.homing:
            if all(not motor.homing for motor in self.motors):
                logger('All motors are home!')
                self.homing = False
        self.emit('meta')
        self.emit('state')

    def robot_state(self):
        self.emit('state')

    def robot_encoder(self):
        self.emit('encoder')
        self.encoder_timer = threading.Timer(0.1, self.robot_encoder)
        self.encoder_timer.start()

    def motor_moved(self, id):
        logger(f'Motor {id} moved')
        # If we are moving robot to a position check if it's done
        if self.moving:
            if all(not motor.moving for motor in self.motors):
                logger('All motors have moved!')
                self.moving = False
                self.emit('moved')
        # Let others know
        self.emit('meta')
        self.emit('state')

    def robot_home(self):
        logger('Home robot')
        # Validate action
        if not self.validate(enabled=True, cleared=True, log='attempting to home'):
            return
        # Update our state
        self.homing = True
        self.moving = True
        # Because a motor might complete faster than all the others start we need to make sure we initialize all to homing + moving ;)
        for motor in self.motors:
            if motor.enabled:
                motor.homing = True
                motor.moving = True
        # Home all motors
        for motor in self.motors:
            motor.go_home()
        self.emit('meta')

    def robot_zero(self):
        logger('Zero robot')
        # Zero out all motors
        for motor in self.motors:
            motor.zero()
        self.emit('meta')

    def robot_zero_ft(self):
        logger('Zero Force Tourque robot')
        self.emit('meta')

    def robot_calibrate(self):
        logger('Calibrate robot')

    def robot_split_home(self):
        logger('Split home robot')

    def robot_stop(self):
        logger('Stop robot')
        self.stopped = True
        # Disable all motors
        for motor in self.motors:
            motor.disable()
        self.emit('meta')

    def robot_freeze(self):
        logger('Freeze robot')
        # Freeze all motors (stops but does not disable)
        for motor in self.motors:
            motor.freeze()
        self.emit('meta')

    def robot_center(self):
        logger('Center robot')
        # We are moving the whole robot
        self.moving = True
        # Centers all motors
        for motor in self.motors:
            motor.center()
        self.emit('meta')

    def robot_enable(self):
        logger('Enable robot')
        self.stopped = False
        # Enable all motors
        for motor in self.motors:
            motor.enable()
        self.emit('meta')

    def robot_reset(self):
        logger('Resetting robot errors')
        # Reset all motors errors
        for motor in self.motors:
            motor.reset_errors()
        # Reset all robot errors
        self.errors = []
        self.emit('meta')

    def robot_set_angles(self, angles, speed):
        logger(f'robotSetAngles at speed {speed} angles: {angles}')
        # Validate action
        if not self.validate(enabled=True, cleared=True, log='attempting to move'):
            return
        # We are moving to a new location
        self.moving = True
        # Because a motor might complete faster than all the others start we need to make sure we initialize all to moving ;)
        for motor in self.motors:
            if motor.enabled:
                motor.moving = True

        # Step1: Determine travelSpeed and acceleration
        travel_speed = speed
        acceleration = speed
        # Step2: Move via speed for each based on time
        for motor, angle in zip(self.motors, angles):
            logger(
                f'Setting angle for motor {motor.id} at speed {speed} and angle: {angle}')
            motor.set_position(angle, travel_speed, acceleration)
        self.emit('meta')

    def robot_freedrive_enable(self, frame, cartFloatingAxis, nullspace=False):
        logger('Enabling freedrive')
        self.freedrive = True
        self.emit('meta')

    def robot_freedrive_disable(self):
        logger('Disabling freedrive')
        self.freedrive = False
        self.emit('meta')

    def motor_set_position(self, id, pos, speed):
        logger(f'Set position for motor {id}')
        self.motor_map[id].set_position(pos, speed)

    def motor_home(self, id):
        logger(f'Home motor {id}')
        self.motor_map[id].go_home()

    def motor_reset_errors(self, id):
        logger(f'Reset motor errors for motor {id}')
        self.motor_map[id].reset_errors()

    def motor_enable(self, id):
        logger(f'Enable motor {id}')
        self.motor_map[id].enable()

    def motor_disable(self, id):
        logger(f'Disable motor {id}')
        self.motor_map[id].disable()

    def motor_zero(self, id):
        logger(f'Zero motor {id}')
        self.motor_map[id].zero()

    def gripper_set_position(self, pos, speed=500, force=0):
        logger(
            f'Set position for gripper to {pos}, at speed {speed} with force {force}')
