import { cleanMatrix } from './roundMatrix';

/**
 * Z-X-Z
 *
 * @param {*} a
 * @param {*} b
 * @param {*} c
 * @returns
 */
export const zxz = (a, b, c) => {
  const res = [
    [
      Math.cos(a) * Math.cos(c) + -Math.sin(a) * Math.cos(b) * Math.sin(c),
      Math.cos(a) * -Math.sin(c) + -Math.sin(a) * Math.cos(b) * Math.cos(c),
      -Math.sin(a) * -Math.sin(b),
    ],
    [
      Math.sin(a) * Math.cos(c) + Math.cos(a) * Math.cos(b) * Math.sin(c),
      Math.sin(a) * -Math.sin(c) + Math.cos(a) * Math.cos(b) * Math.cos(c),
      Math.cos(a) * -Math.sin(b),
    ],
    [Math.sin(b) * Math.sin(c), Math.sin(b) * Math.cos(c), Math.cos(b)],
  ];

  return cleanMatrix(res);
};

/**
 * X-Y-Z ( yaw + pitch + roll )
 *
 * yaw pitch and roll are the euler angles
 * yaw is the rotation around the x axis
 * pitch is the rotation around the y axis
 * roll is the rotation around the z axis
 * the output is the rotation matrix as a 3 x 3 matrix
 * clean the matrix by removing all negative zeros and rounding all numbers to 2 decimal places
 *
 */
export const xyz = (yaw, pitch, roll) => {
  const c1 = Math.cos(yaw);
  const c2 = Math.cos(pitch);
  const c3 = Math.cos(roll);
  const s1 = Math.sin(yaw);
  const s2 = Math.sin(pitch);
  const s3 = Math.sin(roll);
  return cleanMatrix([
    [c1 * c2, c1 * s2 * s3 - c3 * s1, s1 * s3 + c1 * c3 * s2],
    [c2 * s1, c1 * c3 + s1 * s2 * s3, c3 * s1 * s2 - c1 * s3],
    [-s2, c2 * s3, c2 * c3],
  ]);
};

// (a, b, c) => {
//   const res = [
//     [
//       Math.cos(a) * Math.cos(b),
//       -Math.sin(a) * Math.cos(c) + Math.cos(a) * Math.sin(b) * Math.sin(c),
//       -Math.sin(a) * -Math.sin(c) + Math.cos(a) * Math.sin(b) * Math.cos(c),
//     ],
//     [
//       Math.sin(a) * Math.cos(b),
//       Math.cos(a) * Math.cos(c) + Math.sin(a) * Math.sin(b) * Math.sin(c),
//       Math.cos(a) * -Math.sin(c) + Math.sin(a) * Math.sin(b) * Math.cos(c),
//     ],
//     [-Math.sin(b), Math.cos(b) * Math.sin(c), Math.cos(b) * Math.cos(c)],
//   ];

//   return cleanMatrix(res);
// };
