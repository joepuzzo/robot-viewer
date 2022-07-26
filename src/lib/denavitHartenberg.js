import { matrixDot } from './matrixDot';
import { round } from './round';

// Frame Rules ( for Denavit Hartenberg - shortcuts )
// 1. The Z axis must be the axis of rotation for a revolute joint,
//    or direction of motion if you have prismatic joint.
//
// 2. The X axis must be perpendicular both to its own Z axis
//    and the Z axis of the frame before it
//
// 3. All frames must follow the right hand rule
//     y
//     ^
//     |
//  ( thumb -z ) ------- fingers --> X
//
// 4. Each X axis must intersect the Z axis of the frame before it ( except frame 0 )
//

// ---------- Time for Denavit Hartenberg!!!!! ----------

//
// 						             Zn
// 					                ^
// 					                |  Yn
// 					  	            |   /
// 					                |  /
// 					                | /
// 	    |_______[r]_______| + -----------> Xn
//
//      Zn-1				 |
//      ^			  		 |
//      |  Yn-1			[d]
//   	  |   /				 |
//      |  /			 	 |
//      | /  				 |
//      + -----------> Xn-1
//
// Step1: write out your kinimatic diagram accoding to the rules
//
// Step2: perform the following for each Hn_m
//
// theta = rotation around `Zn-1` that is required to get axis `Xn-1` to match `Xn` ( rotate frame n-1)
// alpha = rotation around `Xn` that is required to get axis `Zn-1` to match axis `Zn` ( rotate frame n-1 )
// r  = look at distance between center of two frames along the `Xn` direction
// d = look at the distance between center of two fames along `Zn-1` direction.

/** -----------------------------------------------------------------------------
 *
 * @param {*} row
 * @returns
 */
export const buildHomogeneousDenavitForRow = (row) => {
  // Get variables for this row
  const theta = row[0];
  const alpha = row[1];
  const r = row[2];
  const d = row[3];

  return [
    [
      round(Math.cos(theta)),
      round(-Math.sin(theta) * Math.cos(alpha)),
      round(Math.sin(theta) * Math.sin(alpha)),
      round(r * Math.cos(theta)),
    ],
    [
      round(Math.sin(theta)),
      round(Math.cos(theta) * Math.cos(alpha)),
      round(-Math.cos(theta) * Math.sin(alpha)),
      round(r * Math.sin(theta)),
    ],
    [0, round(Math.sin(alpha)), round(Math.cos(alpha)), d],
    [0, 0, 0, 1],
  ];
};

/** -----------------------------------------------------------------------------
 *
 * @param {*} pt
 * @returns
 */
export const buildHomogeneousDenavitForTable = (pt) => {
  // Build individual matricies
  const matriceis = pt.map((row) => buildHomogeneousDenavitForRow(row));

  // Matrix multiply them all
  // [h0_1,h1_2,h2_3,h3_4 ...]
  // return(h0_2) = h0_1 * h0_2;
  // return(h0_3) = h0_2 * h2_2;
  // ...
  const endMatrix = matriceis.reduce((acc, cur, i) => {
    return matrixDot(acc, cur);
  });

  return {
    matriceis,
    endMatrix,
  };
};

/** -----------------------------------------------------------------------------
 * sin(d90) = 1
 * sin(0) = 0
 */
const generateSin = (a) => {
  let sinA = `Math.sin(${a})`;
  if (a === 'd90') {
    sinA = '1';
  }
  if (a === '-d90') {
    sinA = '-1';
  }
  if (a === '0') {
    sinA = '0';
  }
  return sinA;
};

/** -----------------------------------------------------------------------------
 * cos(d90) = 0
 * cos(0) = 1
 */
const generateCos = (a) => {
  let cosA = `Math.cos(${a})`;
  if (a === 'd90' || a == '-d90') {
    cosA = '0';
  }
  if (a === '0') {
    cosA = '1';
  }
  return cosA;
};

/** -----------------------------------------------------------------------------
 *
 * Cleans up by looking at 1s and zeros
 *
 * @param {*} a
 * @param {*} b
 * @returns
 */
const checkParameters = (a, b) => {
  // If the result will be zero then return zero
  if (a === '0' || b === '0') {
    return '0';
  }

  // If both are 1 then return 1
  if (a === '1' && b === '1') {
    return '1';
  }

  // If both are -1 then return 1
  if (a === '-1' && b === '-1') {
    return '1';
  }

  // If one of the operands is 1 then just return the other operand
  if (a === '1' || b === '1') {
    return a === '1' ? b : a;
  }

  // If one of the operands is -1 then just return the other operand negated
  if (a === '-1' || b === '-1') {
    return a === '-1' ? `-${b}` : `-${a}`;
  }

  return `${a} * ${b}`;
};

/** -----------------------------------------------------------------------------
 *
 * @param {*} row
 * @returns
 */
export const buildHomogeneousDenavitStringForRow = (row) => {
  // Get variables for this row
  const theta = row[0];
  const alpha = row[1];
  const r = row[2];
  const d = row[3];

  // sin(d90)  = 1
  // sin(-d90) = -1
  // sin(0)    = 0
  let sinAlpha = generateSin(alpha);
  let sinTheta = generateSin(theta);

  // cost(d90) = 0;
  let cosAlpha = generateCos(alpha);
  let cosTheta = generateCos(theta);

  // checkParameters(sinTheta, cosAlpha)
  // equals
  // `${sinTheta} * ${sinAlpha}` or 0 or 1 or sinTheta or sinAlpha or - sinTheta or -sinAlpha

  return [
    [
      `${cosTheta}`,
      `-${checkParameters(sinTheta, cosAlpha)}`.replace('--', ''),
      `${checkParameters(sinTheta, sinAlpha)}`,
      `${checkParameters(r, cosTheta)}`,
    ],
    [
      `${sinTheta}`,
      `${checkParameters(cosTheta, cosAlpha)}`,
      `-${checkParameters(cosTheta, sinAlpha)}`.replace('--', ''),
      `${checkParameters(r, sinTheta)}`,
    ],
    [`0`, `${sinAlpha}`, `${cosAlpha}`, `${d}`],
    [`0`, `0`, `0`, `1`],
  ];
};

/** -----------------------------------------------------------------------------
 *
 * @param {*} pt
 * @returns
 */
export const buildHomogeneousDenavitStringForTable = (pt) => {
  // Build individual matricies
  const homogeneousMatriceis = pt.map((row) => buildHomogeneousDenavitStringForRow(row));

  // Matrix multiply them all
  // [h0_1,h1_2,h2_3,h3_4 ...]
  // return(h0_2) = h0_1 * h0_2;
  // return(h0_3) = h0_2 * h2_2;
  // ...
  const endHomogeneous = homogeneousMatriceis.reduce((acc, cur, i) => {
    return matrixDotString(acc, cur);
  });

  const rotationalMatricies = homogeneousMatriceis.map((mat) => matrixSubset(mat, 3, 3));

  const endRotation = rotationalMatricies.reduce((acc, cur, i) => {
    return matrixDotString(acc, cur);
  });

  return {
    homogeneousMatriceis,
    rotationalMatricies,
    endHomogeneous,
    endRotation,
  };
};
