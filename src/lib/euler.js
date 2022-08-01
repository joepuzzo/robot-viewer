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
 * @param {*} a
 * @param {*} b
 * @param {*} c
 * @returns
 */
export const xyz = (a, b, c) => {
  const res = [
    [
      Math.cos(a) * Math.cos(b),
      -Math.sin(a) * Math.cos(c) + Math.cos(a) * Math.sin(b) * Math.sin(c),
      -Math.sin(a) * -Math.sin(c) + Math.cos(a) * Math.sin(b) * Math.cos(c),
    ],
    [
      Math.sin(a) * Math.cos(b),
      Math.cos(a) * Math.cos(c) + Math.sin(a) * Math.sin(b) * Math.sin(c),
      Math.cos(a) * -Math.sin(c) + Math.sin(a) * Math.sin(b) * Math.cos(c),
    ],
    [-Math.sin(b), Math.cos(b) * Math.sin(c), Math.cos(b) * Math.cos(c)],
  ];

  return cleanMatrix(res);
};
