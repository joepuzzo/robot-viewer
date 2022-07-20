// sin(t)	= opposite / hypotenuse
// cos(t)	= adjacent / hypotenuse
// tan(t)	= opposite / adjacent

// All x1, y1, z1 = 1

// Therefore
//
// hypotenuse = 1
//
// sin(t)	= opposite / 1
// cos(t)	= adjacent / 1
// tan(t)	= opposite / adjacent
//
// OR
// sin(t)	= opposite
// cos(t)	= adjacent
// tan(t)	= opposite / adjacent

const toRadians = (deg) => {
  return (deg / 180) * Math.PI;
};

const identityMatrix = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
];

const printMatrix = (m) => {
  // m.forEach((a) => console.log(`${a}`));
  // console.log('\n');
  console.table(m);
};

/**
 *      Z0
 *       ^
 *       |
 *   Z1  |   Y1
 *    \  |  /
 *     \ | /
 *       + -----------> Y0
 *      /
 *     /
 *    /
 * X0-X1
 *
 */
// prettier-ignore
function rotateAroundXAxis(a) {
  //[x1,        y1,             z1]
  return [
    [1,   0,              0           ],   // x0
    [0,   Math.cos(a),    -Math.sin(a)],   // y0
    [0,   Math.sin(a),    Math.cos(a) ],   // z0
  ];
}

/**
 *      Z0
 *       ^
 *       |
 *   X1  |   Z1
 *    \  |  /
 *     \ | /
 *       + -----------> Y0-Y1
 *      /
 *     /
 *    /
 *  X0
 *
 */
// prettier-ignore
function rotateAroundYAxis(a) {
  //[x1,            y1,          z1]
  return [
    [Math.cos(a),   0,      Math.sin(a)], // x0
    [0,             1,      0          ], // y0
    [-Math.sin(a),  0,      cos(a)     ], // z0 
  ];
}

/**
 *     Z0-Z1
 *       ^
 *       |
 *       |   Y1
 *       |  /
 *       | /
 *       + -----------> Y0
 *      / \
 *     /   \
 *    /     X1
 *  X0
 *
 */
// prettier-ignore
function rotateAroundZAxis(a) {
  //[x1,          y1,           z1]
  return [
    [Math.cos(a), -Math.sin(a), 0], // x0
    [Math.sin(a), Math.cos(a),  0], // y0
    [0,           0,            1], // z0
  ];
}

function matrixDot(a, b) {
  var result = new Array(a.length).fill(0).map((row) => new Array(b[0].length).fill(0));

  return result.map((row, i) => {
    return row.map((val, j) => {
      return a[i].reduce((sum, elm, k) => sum + elm * b[k][j], 0);
    });
  });
}

let t1 = 90; // Theta 1 angle in degrees
let t2 = 0; // Theta 2 angle in degrees

t1 = toRadians(t1);
t2 = toRadians(t2);

const r0_1 = rotateAroundZAxis(t1);
const r1_2 = rotateAroundZAxis(t2);

printMatrix(r0_1);
printMatrix(r1_2);

const r0_2 = matrixDot(r0_1, r1_2);

printMatrix(r0_2);
