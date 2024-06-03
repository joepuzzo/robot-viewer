import socketio
import json
from robot import Robot
from debug import Debug

logger = Debug('mock:server\t')

sio = socketio.Client()


def emit(event, data):
    if sio.connected:
        sio.emit(event, data, namespace='/robot')
    else:
        logger(f'Socket not connected. Cannot emit {event}')


def start_server(config):
    # Create socket
    connection_string = f"http://{config['host']}:{config['port']}?id={config['id']}"
    logger(f'Creating socket with connection string: {connection_string}')

    # Create robot
    robot = Robot(config)

    # ---------- Subscribe to socket events ----------
    @sio.event(namespace='/robot')
    def connect():
        logger('Connected to server')
        if robot.ready:
            emit('register', robot.meta)
            emit('state', robot.state)

    @sio.event(namespace='/robot')
    def connect_error(data):
        logger(f'Failed to connect to server: {data}')

    @sio.event(namespace='/robot')
    def disconnect():
        logger('Disconnected from server')

    # Attempt to connect to the server
    logger('Attempting to connect to the server...')
    sio.connect(connection_string, namespaces=['/robot'])

    # ---------- Subscribe to robot events ----------
    @robot.on('state')
    def on_state():
        logger('Sending state')
        emit('state', robot.state)

    @robot.on('encoder')
    def on_encoder():
        # Specifically don't log here (too much logging)
        emit('encoder', robot.state)

    @robot.on('ready')
    def on_ready():
        logger('Robot ready, sending state and registering')
        emit('register', robot.meta)
        emit('state', robot.state)

    @robot.on('meta')
    def on_meta():
        logger('Sending meta')
        emit('register', robot.meta)

    @robot.on('moved')
    def on_moved():
        logger('Sending moved')
        emit('moved', robot.meta)

    @robot.on('pulse')
    def on_pulse(id, pos):
        emit('pulse', id)

    # ---------- Subscribe to controller commands ----------
    @sio.on('hello', namespace='/robot')
    def on_hello(msg):
        logger('Controller says hello')

    @sio.on('motorSetPos', namespace='/robot')
    def on_motor_set_pos(id, pos, speed=40):
        logger(
            f"Controller says setMotorPos to {pos} at speed {speed} for motor {id}")
        robot.motor_set_position(id, pos, speed)

    @sio.on('motorResetErrors', namespace='/robot')
    def on_motor_reset_errors(id):
        logger(f"Controller says resetErrors for motor {id}")
        robot.motor_reset_errors(id)

    @sio.on('motorEnable', namespace='/robot')
    def on_motor_enable(id):
        logger(f"Controller says enableMotor {id}")
        robot.motor_enable(id)

    @sio.on('motorDisable', namespace='/robot')
    def on_motor_disable(id):
        logger(f"Controller says disableMotor {id}")
        robot.motor_disable(id)

    @sio.on('motorCalibrate', namespace='/robot')
    def on_motor_calibrate(id):
        logger(f"Controller says calibrateMotor {id}")
        robot.motor_calibrate(id)

    @sio.on('motorReference', namespace='/robot')
    def on_motor_reference(id):
        logger(f"Controller says referenceMotor {id}")
        robot.motor_reference(id)

    @sio.on('motorHome', namespace='/robot')
    def on_motor_home(id):
        logger(f"Controller says motorHome {id}")
        robot.motor_home(id)

    @sio.on('motorZero', namespace='/robot')
    def on_motor_zero(id):
        logger(f"Controller says motorZero {id}")
        robot.motor_zero(id)

    @sio.on('gripperSetPos', namespace='/robot')
    def on_gripper_set_pos(pos, speed, force):
        logger(
            f"Controller says gripperSetPos to {pos} at speed {speed} with force {force}")
        robot.gripper_set_position(pos, speed, force)

    @sio.on('robotHome', namespace='/robot')
    def on_robot_home():
        logger(f"Controller says home robot")
        robot.robot_home()

    @sio.on('robotSplitHome', namespace='/robot')
    def on_robot_split_home():
        logger(f"Controller says splitHome robot")
        robot.robot_split_home()

    @sio.on('robotStop', namespace='/robot')
    def on_robot_stop():
        logger(f"Controller says stop robot")
        robot.robot_stop()

    @sio.on('robotFreeze', namespace='/robot')
    def on_robot_freeze():
        logger(f"Controller says freeze robot")
        robot.robot_freeze()

    @sio.on('robotEnable', namespace='/robot')
    def on_robot_enable():
        logger(f"Controller says enable robot")
        robot.robot_enable()

    @sio.on('robotCenter', namespace='/robot')
    def on_robot_center():
        logger(f"Controller says center robot")
        robot.robot_center()

    @sio.on('robotSetAngles', namespace='/robot')
    def on_robot_set_angles(angles, speed):
        logger(f"Controller says setAngles for robot")
        robot.robot_set_angles(angles, speed)

    @sio.on('robotUpdateConfig', namespace='/robot')
    def on_robot_update_config(key, value):
        logger(f"Controller says updateConfig for robot")
        robot.update_config(key, value)

    @sio.on('robotWriteConfig', namespace='/robot')
    def on_robot_write_config():
        logger(f"Controller says writeConfig for robot")
        robot.write_config()

    @sio.on('robotAccelEnabled', namespace='/robot')
    def on_robot_accel_enabled(value):
        logger(f"Controller says accelEnabled for robot to {value}")
        robot.robot_accel_enabled(value)

    @sio.on('robotResetErrors', namespace='/robot')
    def on_robot_reset_errors():
        logger(f"Controller says resetErrors for robot")
        robot.robot_reset()

    @sio.on('robotReference', namespace='/robot')
    def on_robot_reference():
        logger(f"Controller says reference robot")
        robot.robot_reference()

    @sio.on('robotZero', namespace='/robot')
    def on_robot_zero():
        logger(f"Controller says zero robot")
        robot.robot_zero()

    @sio.on('robotZeroFT', namespace='/robot')
    def on_robot_zero_ft():
        logger(f"Controller says zero force tourque robot")
        robot.robot_zero_ft()

    @sio.on('home', namespace='/robot')
    def on_home():
        logger(f"Controller says home robot")
        robot.home()

    @sio.on('robotFreedriveEnable', namespace='/robot')
    def on_robot_freedrive_enable(frame, cartFloatingAxis, nullspace=False):
        logger(
            f"Controller says enable freedrive with frame {frame}, cartFloatingAxis {json.dumps(cartFloatingAxis, indent=4)}, and nullspace {nullspace}"
        )
        robot.robot_freedrive_enable(frame, cartFloatingAxis, nullspace)

    @sio.on('robotFreedriveDisable', namespace='/robot')
    def on_robot_freedrive_disable():
        logger(f"Controller says disable freedrive")
        robot.robot_freedrive_disable()

    sio.wait()
