import { buildHomogeneousDenavitForTable } from './denavitHartenberg';
import { toDeg } from './toDeg';
import { toRadians } from './toRadians';

// Example input
// const exampleAngles = [45, 30, -15, 60, 0, -45];
// const exampleConfig = {
//   dhParameters: [
//     { theta: 0, alpha: 90, r: 0, d: 25.2 },
//     { theta: 90, alpha: 0, r: 23.7, d: 0 },
//     { theta: -90, alpha: -90, r: 0, d: 0 },
//     { theta: 0, alpha: 90, r: 0, d: 29.7 },
//     { theta: 0, alpha: -90, r: 0, d: 0 },
//     { theta: 0, alpha: 0, r: 0, d: 22.6 },
//   ],
// };

/**
 * Calculate the forward kinematics of a robotic arm given joint angles and DH parameters.
 * @param {number[]} angles - Array of joint angles in degrees.
 * @param {Object} config - Configuration object containing DH parameters.
 * @param {Object[]} config.dhParameters - Array of DH parameters objects.
 * @param {number} config.dhParameters[].theta - Angle between the Z axes of consecutive links (in degrees).
 * @param {number} config.dhParameters[].alpha - Angle between the X axes of consecutive links (in degrees).
 * @param {number} config.dhParameters[].r - Distance along the X axis between consecutive origins.
 * @param {number} config.dhParameters[].d - Distance along the Z axis between consecutive origins.
 * @returns {Object} - Object containing position and orientation of the end-effector.
 */
export const forwardKinematics = (angles, config) => {
  // Extract DH parameters from config and convert them to radians
  const dhParameters = config.dhParameters.map((param) => [
    toRadians(param.theta),
    toRadians(param.alpha),
    param.r,
    param.d,
  ]);

  // Convert angles to radians
  const anglesRad = angles.map((angle) => toRadians(angle));

  // Adjust DH parameters based on joint angles
  const adjustedDHParameters = dhParameters.map((param, i) => [
    param[0] + anglesRad[i], // Adjust theta based on joint angle
    param[1],
    param[2],
    param[3],
  ]);

  // Build the homogeneous Denavit-Hartenberg transformation matrix
  const res = buildHomogeneousDenavitForTable(adjustedDHParameters);

  // Extract position (x, y, z) from transformation matrix
  const position = [res.endMatrix[0][3], res.endMatrix[1][3], res.endMatrix[2][3]];

  // Extract rotation matrix elements
  const r11 = res.endMatrix[0][0];
  const r12 = res.endMatrix[0][1];
  const r13 = res.endMatrix[0][2];
  const r21 = res.endMatrix[1][0];
  const r22 = res.endMatrix[1][1];
  const r23 = res.endMatrix[1][2];
  const r31 = res.endMatrix[2][0];
  const r32 = res.endMatrix[2][1];
  const r33 = res.endMatrix[2][2];

  // Calculate orientation angles
  const orientation = [
    toDeg(Math.atan2(r32, r33)), // r1: rotation around z1 axis
    toDeg(Math.atan2(-r31, Math.sqrt(r32 ** 2 + r33 ** 2))), // r2: rotation around x axis
    toDeg(Math.atan2(r21, r11)), // r3: rotation around z2 axis
  ];

  // Return position and orientation
  return { position, orientation };
};
