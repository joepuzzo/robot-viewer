export const TYPE_MAPPING = {
  AR4: {
    position: 'encoderPosition',
  },
  Example: {
    position: 'currentPos',
  },
  IgusRebel: {
    position: 'currentPosition',
  },
  Rizon4: {
    position: 'angle',
  },
};

// Example AR
export const EXAMPLE_AR_JOINT_DATA = {
  id: 'j0',
  homing: false,
  home: false,
  homed: false,
  enabled: true,
  moving: true,
  ready: true,
  stepPosition: -7733,
  encoderPosition: 77309,
  error: 'Ahh!!!!',
};

// EXAMPLE IGUS
export const EXAMPLE_IGUS_JOINT_DATA = {
  id: 'j0',
  canId: 16,
  homing: false,
  home: false,
  // TODO add to backend vvv
  ready: true,
  enabled: false,
  moving: false,
  // TODO add to backend ^^^
  currentPosition: 90.000235647645,
  currentTics: 8000,
  encoderPulsePosition: 90.000235647645,
  encoderPulseTics: 8000,
  jointPositionSetPoint: 90,
  jointPositionSetTics: 8000,
  goalPosition: 90,
  motorCurrent: 120,
  error: null,
  errorCode: null,
  errorCodeString: 'n/a',
  voltage: 0,
  tempMotor: 20,
  tempBoard: 30,
  direction: 'forwards',
  motorError: null,
  adcError: null,
  rebelError: null,
  controlError: null,
  sendInterval: 20,
  calculatedVelocity: 29,
  currentVelocity: 30,
  positionHistory: [
    { time: 1, pos: 10 },
    { time: 2, pos: 20 },
    { time: 3, pos: 30 },
    { time: 4, pos: 30 },
    { time: 5, pos: 10 },
  ],
};
