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

## Connecting to Robots

In order to connect to the robots you will need to be connected to the same network as the robots. All communication occurs via socket.io. You will need to have implimented the robot protocol. Every socket event is described below, and in addition there are specific events from the robot you need to subscibe to.

### Socket Events

##### Generic Events

| Event      | Description                 | Parameters |
| ---------- | --------------------------- | ---------- |
| connect    | Connects to the socket      | None       |
| hello      | Receives a hello message    | msg        |
| disconnect | Disconnects from the socket | None       |
| home       | Homes the robot (generic)   | None       |

##### Robot Events

| Event             | Description                       | Parameters    |
| ----------------- | --------------------------------- | ------------- |
| robotHome         | Homes the robot                   | None          |
| robotSplitHome    | Homes the robot in split mode     | None          |
| robotStop         | Stops the robot                   | None          |
| robotFreeze       | Freezes the robot                 | None          |
| robotEnable       | Enables the robot                 | None          |
| robotCenter       | Centers the robot                 | None          |
| robotSetAngles    | Sets the robot's angles           | angles, speed |
| robotUpdateConfig | Updates the robot's configuration | key, value    |
| robotWriteConfig  | Writes the robot's configuration  | None          |
| robotAccelEnabled | Enables robot acceleration        | value         |
| robotResetErrors  | Resets the robot's errors         | None          |
| robotReference    | References the robot              | None          |
| robotZero         | Zeros the robot                   | None          |

**TODO** The following events are not implimented yet.

| Event                 | Description                     | Parameters              |
| --------------------- | ------------------------------- | ----------------------- |
| robotFreedriveEnable  | Enables Freedrive On the Robot  | frame, cartFloatingAxis |
| robotFreedriveDisable | Disables Freedrive On the Robot | None                    |

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

### Robot Events

| Event   | Description                   | Parameters              |
| ------- | ----------------------------- | ----------------------- |
| state   | Emits the robot's state       | robot.state             |
| encoder | Emits encoder data            | robot.state             |
| ready   | Emits when the robot is ready | robot.meta, robot.state |
| meta    | Emits metadata                | robot.meta              |
| moved   | Emits when the robot moves    | robot.meta              |
| pulse   | Emits pulse data              | id, pos                 |

#### Notes:

Meta is specific information about the robot that is not constantly updated, see example object below:

```js
get meta(){
    // return meta
    return {
        stopped: this.stopped,   // boolean if robot is currently stopped
        ready: this.ready,       // boolean if robot is currently ready
        home: this.home,         // boolean if robot is currently home
        homing: this.homing,     // boolean if robot is currently homing
        moving: this.moving,     // boolean if robot is currently moving
        config: this.config,     // Current robot configuration
        motors: this.motorsMeta, // Metadata about motors ( example CAN ID )
    }
}
```

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
| home                |      | X   |
| disconnect          | X    | X   |
