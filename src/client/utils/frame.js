import { intersect } from 'mathjs';
import { matrixDot } from '../../lib/matrixDot';

function rotateAroundXAxis(matrix, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const rotation = [
    [1, 0, 0, 0],
    [0, cos, -sin, 0],
    [0, sin, cos, 0],
    [0, 0, 0, 1],
  ];
  return matrixDot(matrix, rotation);
}

function rotateAroundYAxis(matrix, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const rotation = [
    [cos, 0, sin, 0],
    [0, 1, 0, 0],
    [-sin, 0, cos, 0],
    [0, 0, 0, 1],
  ];
  return matrixDot(matrix, rotation);
}

function rotateAroundZAxis(matrix, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const rotation = [
    [cos, -sin, 0, 0],
    [sin, cos, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ];
  return matrixDot(matrix, rotation);
}

/**
 * Example: The X axis against the Z axis of the frame before it 2, 0
 * Example: The Z axis against the Z axis of the frame before it 2, 2
 *
 *        X2  Y2  Z2
 *   X1 [ 1,  0,  0,  dx]
 *   Y1 [ 0,  1,  0,  dy]
 *   Z1 [ 0,  0,  1,  dz]
 *      [ 0,  0,  0,  1]
 *
 * x, z = matrix[2][0]
 * z, z = matrix[2][2]
 * y, x = matrix[0][1]
 * x, y = matrix[1][0]
 */
const INDEX_MAP = { x: 0, y: 1, z: 2 };
export const fromMatrix = (matrix, b, a) => {
  const index1 = INDEX_MAP[a];
  const index2 = INDEX_MAP[b];
  return matrix[index1][index2];
};

/**
 * Determines if the given lines are perpendicular to eachother
 *
 * @param {*} dx - distance in x from previous frame
 * @param {*} dy - distance in y from previous frame
 * @param {*} dz - distance in z from previous frame
 * @param {*} rx_deg - rotation around previous frames x in degrees
 * @param {*} ry_deg - rotation around previous frames y in degrees
 * @param {*} rz_deg - rotation around previous frames z in degrees
 * @param {*} a - the new frame
 * @param {*} b - the previous frame
 * @returns
 *
 *        X2  Y2  Z2
 *   X1 [ 1,  0,  0,  dx]
 *   Y1 [ 0,  1,  0,  dy]
 *   Z1 [ 0,  0,  1,  dz]
 *      [ 0,  0,  0,  1]
 *
 */
export function isPerpendicular(dx, dy, dz, rx_deg, ry_deg, rz_deg, b, a) {
  // Convert rotations from degrees to radians
  const rx = (rx_deg * Math.PI) / 180;
  const ry = (ry_deg * Math.PI) / 180;
  const rz = (rz_deg * Math.PI) / 180;

  // Create 4x4 transformation matrix using the rotations and offsets
  let transform = [
    [1, 0, 0, dx],
    [0, 1, 0, dy],
    [0, 0, 1, dz],
    [0, 0, 0, 1],
  ];

  // Apply rotations to the matrix
  transform = rotateAroundXAxis(transform, rx);
  transform = rotateAroundYAxis(transform, ry);
  transform = rotateAroundZAxis(transform, rz);

  // Check if the a axis of the new frame is perpendicular to the b axis of the previous frame
  // return Math.abs(transform[a][b]) === 0;
  return Math.abs(fromMatrix(transform, b, a)) === 0;
}

/**
 * Determines if the given lines are parallel to eachother
 *
 * @param {*} dx - distance in x from previous frame
 * @param {*} dy - distance in y from previous frame
 * @param {*} dz - distance in z from previous frame
 * @param {*} rx_deg - rotation around previous frames x in degrees
 * @param {*} ry_deg - rotation around previous frames y in degrees
 * @param {*} rz_deg - rotation around previous frames z in degrees
 * @param {*} b - the new frame
 * @param {*} a - the previous frame
 * @returns
 *
 *        X2  Y2  Z2
 *   X1 [ 1,  0,  0,  dx]
 *   Y1 [ 0,  1,  0,  dy]
 *   Z1 [ 0,  0,  1,  dz]
 *      [ 0,  0,  0,  1]
 *
 */
export function isParallel(dx, dy, dz, rx_deg, ry_deg, rz_deg, b, a, direction = false) {
  // Convert rotations from degrees to radians
  const rx = (rx_deg * Math.PI) / 180;
  const ry = (ry_deg * Math.PI) / 180;
  const rz = (rz_deg * Math.PI) / 180;

  // Create 4x4 transformation matrix using the rotations and offsets
  let transform = [
    [1, 0, 0, dx],
    [0, 1, 0, dy],
    [0, 0, 1, dz],
    [0, 0, 0, 1],
  ];

  // Apply rotations to the matrix
  transform = rotateAroundXAxis(transform, rx);
  transform = rotateAroundYAxis(transform, ry);
  transform = rotateAroundZAxis(transform, rz);

  if (!direction) {
    // Check if the a axis of the new frame is parallel to the b axis of the previous frame
    // return Math.abs(transform[a][b]) === 1;
    return Math.abs(fromMatrix(transform, b, a)) === 1;
  } else {
    return fromMatrix(transform, b, a) === 1;
  }
}

function createVector(point1, point2) {
  const x = point2[0] - point1[0];
  const y = point2[1] - point1[1];
  const z = point2[2] - point1[2];

  return [x, y, z];
}

// For Learning Direction Vector https://www.youtube.com/watch?v=R5r1IH2hII8
// For Learing intersections https://www.youtube.com/watch?v=N-qUfr-rz_Y
export function xIntersectsZ(dx, dy, dz, rx_deg, ry_deg, rz_deg) {
  // Convert rotations from degrees to radians
  const rx = (rx_deg * Math.PI) / 180;
  const ry = (ry_deg * Math.PI) / 180;
  const rz = (rz_deg * Math.PI) / 180;

  // Create 4x4 transformation matrix using the rotations and offsets
  let transform = [
    [1, 0, 0, dx],
    [0, 1, 0, dy],
    [0, 0, 1, dz],
    [0, 0, 0, 1],
  ];

  // Apply rotations to the matrix
  transform = rotateAroundXAxis(transform, rx);
  transform = rotateAroundYAxis(transform, ry);
  transform = rotateAroundZAxis(transform, rz);

  const xP1 = [dx, dy, dz];
  const xP2 = [transform[0][0] + dx, transform[1][0] + dy, transform[2][0] + dz];

  const zP1 = [0, 0, 0];
  const zP2 = [0, 0, 1];

  // TODO use ours instead of maths
  return intersect(xP1, xP2, zP1, zP2);
}
