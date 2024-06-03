# Robot Viewer

This is a simulator and control interface for 6 axis robotic arms.

## Layout

```bash
# Directory for all the react static site content
src/client/
# Directory for all the node/express server content ( BFF )
src/server/
```

## Getting Started

```bash
# Install any deps
$ npm i

# Start up the node server and webpack dev server
$ npm run start:dev
```

Now go to localhost:3000 and you will see the app!

## Notes

```bash
$ npm run start:dev
```

The above command will run two commands

1.

```bash
$ npm run client:local
```

2.

```bash
$ npm run server:local
```

The first will run a webpack-dev-server ( development server with hot reloading ).

The second will start up the bff ( express-app/node-server ) with the env variable `NODE_ENV=development`

## Build / Deploy

This project contains a Dockerfile that can be built with:

```bash
npm run build:docker
```

To run it locally simply run

```bash
npm run run:docker
```

## Kinematics

![Kinematics Diagram](https://github.com/joepuzzo/robot-viewer/blob/main/src/server/static/KinematicsDiagram.jpg?raw=true)

---

## Mock Javascript Robot ( /example )

We have included a mock robot that simulates the robot protocol. You can run it with the following command.

```bash
cd example
DEBUG='mock:.*' node index.js -p 3000 --host localhost
```

## Mock Python Robot ( /example_py )

## Python Installation

Its reccomended that you set up a viruall python envirnment. Note, you must use version 3.8 or 3.10 of python.

Run the following in the root of the project

```bash
cd example_py
python3.10 -m venv venv
```

The above will set up a virtual envirnment directory. Next you simply activate it.

```bash
source venv/bin/activate
```

This will activate the virtual envirnment. Now all thats left is to install the dependencies

```bash
python -m pip install -r requirements.txt
```

You can run tests like the following from the example_py directory

```bash
DEBUG=mock:.* python test_debug.py
```

Here is how you can run the example robot!

```bash
DEBUG='mock:.*' python main.py --port 3000 --host localhost
```

---

## Connecting to Robots

In order to connect to the robots you will need to be connected to the same network as the robots. All communication occurs via socket.io. You will need to have implimented the robot protocol. Every socket event is described below, and in addition there are specific events from the robot you need to subscibe to.

### Architecture

This application makes up `Robot Viewer` and `Controller`

In addition you can have multiple clients sending commands to the controler and listening to robot updates.

```
+------------------+                 +------------------+               +------------------------+
|                  |                 |                  |               | igus-motor-controller  |
|    RobotViewer   | <-- /client --> |    Controller    | <-- /robot -->| rizon-robot-controller |
|     (Client)     |   (socket.io)   |     (server)     |               | or ...                 |
+------------------+                 +------------------+               +------------------------+
                                               ^
                                               |
+------------------+                           |
|      Custom      |                           |
|   Control/Viewer | <-- /client ---------------
|     (Client)     |   (socket.io)
+------------------+
```

### Socket Control Events

The following are all socket events that can be recieved on the robot side and can be sent via robot-controller.

##### Generic Events

| Event      | Description                 | Parameters |
| ---------- | --------------------------- | ---------- |
| connect    | Connects to the socket      | None       |
| hello      | Receives a hello message    | msg        |
| disconnect | Disconnects from the socket | None       |
| home       | Homes the robot (generic)   | None       |

##### Robot Events

| Event                 | Description                            | Parameters                         |
| --------------------- | -------------------------------------- | ---------------------------------- |
| robotHome             | Homes the robot                        | None                               |
| robotSplitHome        | Homes the robot in split mode          | None                               |
| robotStop             | Stops the robot                        | None                               |
| robotFreeze           | Freezes the robot                      | None                               |
| robotEnable           | Enables the robot                      | None                               |
| robotCenter           | Centers the robot                      | None                               |
| robotSetAngles        | Sets the robot's angles                | angles, speed                      |
| robotUpdateConfig     | Updates the robot's configuration      | key, value                         |
| robotWriteConfig      | Writes the robot's configuration       | None                               |
| robotAccelEnabled     | Enables robot acceleration             | value                              |
| robotResetErrors      | Resets the robot's errors              | None                               |
| robotReference        | References the robot                   | None                               |
| robotZero             | Zeros the robot                        | None                               |
| robotZeroFT           | Zeros the robots force tourque sensors | None                               |
| robotFreedriveEnable  | Enables Freedrive On the Robot         | frame, cartFloatingAxis, nullspace |
| robotFreedriveDisable | Disables Freedrive On the Robot        | None                               |

##### Motor Events

| Event               | Description                   | Parameters          |
| ------------------- | ----------------------------- | ------------------- |
| motorSetPos         | Sets the motor position       | id, pos, speed      |
| motorResetErrors    | Resets the motor's errors     | id                  |
| motorEnable         | Enables the motor             | id                  |
| motorDisable        | Disables the motor            | id                  |
| motorCalibrate      | Calibrates the motor          | id                  |
| motorReference      | References the motor          | id                  |
| queryMotorPosition  | Queries the motor's position  | id                  |
| queryMotorParameter | Queries the motor's parameter | id, index, subindex |
| motorHome           | Homes the motor               | id                  |
| motorZero           | Zeros the motor               | id                  |

##### Gripper Events

| Event         | Description               | Parameters        |
| ------------- | ------------------------- | ----------------- |
| gripperSetPos | Sets the gripper position | pos, speed, force |

---

### Robot State Events

The following are events that are emitted from the robot side and can be listened to on the robot-controller side.

| Event   | Description                   | Parameters              |
| ------- | ----------------------------- | ----------------------- |
| state   | Emits the robot's state       | robot.state             |
| encoder | Emits encoder data            | robot.state             |
| ready   | Emits when the robot is ready | robot.meta, robot.state |
| meta    | Emits metadata                | robot.meta              |
| moved   | Emits when the robot moves    | robot.meta              |
| pulse   | Emits pulse data              | id, pos                 |

**NOTE** These events are not a one to one mapping from robot event --- to ---> client side subscription. There is an internal controller in robot-viewer that handles the emitting of the events and passes them up to the client.

For example the meta event is emitted from the robot, that gets emitted to the robot-controller as a "register" event which is then consumed by the `controller.js` file and emitted to the client as a "robots" event.

```
robot.emit("meta") -----> server.emit("register") -----> client.emit("robots")
```

To make this more clear I created the following table

| Robot Event | Emitted From Robot Server As | Emitted to Client As     |
| ----------- | ---------------------------- | ------------------------ |
|             | connect                      | robots, robotConnected   |
|             | disconnect                   | robots,robotDisconnected |
| state       | state                        | robot                    |
| encoder     | encoder                      | robot                    |
| meta        | register                     | robots                   |
| ready       | register, state              | robots, robot            |
| moved       | moved                        | robotMoved               |
| pulse       | pulse                        | pulse                    |

Now we can take a look at the events that are emitted to the client side.

| Client Event      | Description                                                          | Parameters            |
| ----------------- | -------------------------------------------------------------------- | --------------------- |
| robotConnected    | Emitted when a robot connects to the controller                      | robot.id              |
| robotDisconnected | Emitted when a robot disconnects from the controller                 | robot.id              |
| robot             | Emitted when the robot state changes                                 | robot.id, robot.state |
| robots            | Emitted when a robot registeres, deregisters, or sends updated meta  | [robot.meta]          |
| robotMoved        | Emitted when the robot moves                                         | robot.id, robot.meta  |
| pulse             | Emitted when the robot's motor's pulse data changes ( not used atm ) | motor.id, motor.pos   |

##### Robot Meta

Meta is specific information about the robot that is not constantly updated, see example object below.

```js
const meta = {
  socketId: socketId, // Socket id of the connected robot ( comes from socket io connection in robot-viewers controller )
  id: this.id, // UUID for the connected robot
  stopped: this.stopped, // boolean if robot is currently stopped
  ready: this.ready, // boolean if robot is currently ready
  home: this.home, // boolean if robot is currently home
  homing: this.homing, // boolean if robot is currently homing
  moving: this.moving, // boolean if robot is currently moving
  freedrive: this.freedrive, // boolean if the robot is currently in freedrive
  config: this.config, // Current robot configuration
  motors: this.motorsMeta, // Metadata about motors ( example [{id: 'j0', id: 'j1'}] )
  errors: this.errors, // any current errors on the robot
};
```

##### Robot State

State is specific information about the robot that IS constantly updated, see example object below:

```js
const state = {
  id: 1, // Robot unique id
  motors: {
    // ... motor state depends on the robot type see examples below
  },
};
```

##### Required state attributes

| Attribute | Description                                        |
| --------- | -------------------------------------------------- |
| id        | Unique identifier for the motor e.g "j0", "j1" ... |
| homing    | Indicates if the motor is in the homing process    |
| home      | Indicates if the motor is in the home position     |
| ready     | Indicates if the motor is ready for operation      |
| enabled   | Indicates if the motor is enabled                  |
| moving    | Indicates if the motor is currently moving         |
| error     | Error message                                      |

##### Attributes Specific to AR4 Robot

| Attribute       | Description                                 |
| --------------- | ------------------------------------------- |
| homed           | Indicates if the motor has completed homing |
| stepPosition    | Current step position of the motor          |
| encoderPosition | Current encoder position of the motor       |

##### Attributes Specific to IGUS Robot

| Attribute             | Description                               |
| --------------------- | ----------------------------------------- |
| canId                 | CAN bus identifier for the motor          |
| currentPosition       | Current position in degrees               |
| currentTics           | Current position in tics                  |
| encoderPulsePosition  | Current encoder pulse position in degrees |
| encoderPulseTics      | Current encoder pulse position in tics    |
| jointPositionSetPoint | Set point for joint position in degrees   |
| jointPositionSetTics  | Set point for joint position in tics      |
| goalPosition          | Goal position in degrees                  |
| motorCurrent          | Current motor current                     |
| errorCode             | Error code                                |
| errorCodeString       | String representation of the error code   |
| voltage               | Current voltage                           |
| tempMotor             | Motor temperature                         |
| tempBoard             | Board temperature                         |
| direction             | Direction of motor movement               |
| motorError            | Specific motor error                      |
| adcError              | ADC error                                 |
| rebelError            | Rebel error                               |
| controlError          | Control error                             |
| sendInterval          | Interval at which data is sent            |
| calculatedVelocity    | Calculated velocity                       |
| currentVelocity       | Current velocity                          |
| positionHistory       | History of positions with timestamps      |

---

#### Known implimentations

| Implimentation | Language | Repo                                                                       |
| -------------- | -------- | -------------------------------------------------------------------------- |
| Igus           | JS       | [igus-motor-controller](https://github.com/joepuzzo/igus-motor-controller) |
| AR4            | JS       | [servo](https://github.com/joepuzzo/servo)                                 |

##### Robot Events

| Event   | Igus | AR4 |
| ------- | ---- | --- |
| state   | X    | X   |
| encoder | X    | X   |
| ready   | X    | X   |
| meta    | X    | X   |
| moved   | X    | X   |
| pulse   | X    |     |

##### Socket Events

| Event               | Igus | AR4 |
| ------------------- | ---- | --- |
| connect             | X    | X   |
| hello               | X    | X   |
| motorSetPos         | X    | X   |
| motorResetErrors    | X    | X   |
| motorEnable         | X    | X   |
| motorDisable        | X    | X   |
| motorCalibrate      | X    |     |
| motorReference      | X    |     |
| queryMotorPosition  | X    |     |
| queryMotorParameter | X    |     |
| motorHome           | X    | X   |
| motorZero           | X    | X   |
| gripperSetPos       | X    | X   |
| robotHome           | X    | X   |
| robotSplitHome      |      | X   |
| robotStop           | X    | X   |
| robotFreeze         | X    | X   |
| robotEnable         | X    | X   |
| robotCenter         | X    | X   |
| robotSetAngles      | X    | X   |
| robotUpdateConfig   | X    | X   |
| robotWriteConfig    | X    | X   |
| robotAccelEnabled   | X    |     |
| robotResetErrors    | X    |     |
| robotReference      | X    |     |
| robotZero           | X    |     |
| robotZeroFT         |      |     |
| home                |      | X   |
| disconnect          | X    | X   |
