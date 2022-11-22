/**
 * For X - Y - Z
 * X = Yaw
 * Y = pitch
 * Z = roll
 *
 *       Z
 *       ^
 *       |
 *       |
 *       |
 *       |
 *       + -----------> Y
 *      /
 *     /
 *    /
 *   X
 *
 */

const orientations = {
  xyz: {
    x: [0, 90, 0],
    '-x': [0, -90, 0],
    y: [-90, 0, 0],
    '-y': [90, 0, 0],
    z: [0, 0, 0],
    '-z': [0, 180, 0],
  },
  zxz: {
    x: [90, 90, 90],
    '-x': [-270, -90, -90],
    y: [0, -90, 0],
    '-y': [-180, -90, 0],
    z: [0, 0, 0],
    // '-z': [90, 180, 0],
    '-z': [-90, -180, 0],
    // '-z': [180, 180, 90],
  },
};

export const getXYZ = (orientation) => {
  return orientations['xyz'][orientation];
};

export const getZXZ = (orientation) => {
  return orientations['zxz'][orientation];
};

export const getEulers = (orientation, type) => {
  return orientations[type][orientation];
};
