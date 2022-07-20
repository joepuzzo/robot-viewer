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

const mapping = (c) => (e) => {
  if (e === 3 || e === -3) {
    return `${e < 0 ? '-' : ''}Math.cos(${c})`;
  }
  if (e === 2 || e === -2) {
    return `${e < 0 ? '-' : ''}Math.sin(${c})`;
  }
  return e;
};

const printMatrix = (m, c1, c2) => {
  // m.forEach((a) => console.log(`${a}`));
  // console.log('\n');

  if (c1) {
    const mapped = [m[0].map(mapping(c2)), m[1].map(mapping(c2)), m[2].map(mapping(c2))];
    // console.table(mapped);

    console.log(`const ${c1} = [`);
    mapped.forEach((a) => console.log(`  [${a}],`));
    console.log(']');
  } else {
    console.table(m);
  }
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
let t3 = 0; // Theta 1 angle in degrees
let t4 = 0; // Theta 2 angle in degrees
let t5 = 0; // Theta 1 angle in degrees
let t6 = 0; // Theta 2 angle in degrees

t1 = toRadians(t1);
t2 = toRadians(t2);
t3 = toRadians(t3);
t4 = toRadians(t4);
t5 = toRadians(t5);
t6 = toRadians(t6);

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

/**
 * 1 = 1
 * 2 = sin
 * 3 = cos
 */
const z = [
  [3, -2, 0],
  [2, 3, 0],
  [0, 0, 1],
];

// Define projections

const r0_1_proj = [
  [1, 0, 0],
  [0, 0, -1],
  [0, 1, 0],
];

const r1_2_proj = [
  [0, -1, 0],
  [1, 0, 0],
  [0, 0, 1],
];

const r2_3_proj = [
  [0, 0, 1],
  [-1, 0, 0],
  [0, -1, 0],
];

const r3_4_proj = [
  [1, 0, 0],
  [0, 0, -1],
  [0, 1, 0],
];

const r4_5_proj = [
  [1, 0, 0],
  [0, 0, 1],
  [0, -1, 0],
];

const r5_6_proj = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
];

// Get results

// console.log('R0_1 --------------------------------------------------');
printMatrix(matrixDot(z, r0_1_proj), 'R0_1', 't1');

// console.log('R1_2 --------------------------------------------------');
printMatrix(matrixDot(z, r1_2_proj), 'R1_2', 't2');

// console.log('R2_3 --------------------------------------------------');
printMatrix(matrixDot(z, r2_3_proj), 'R2_3', 't3');

// console.log('R3_4 --------------------------------------------------');
printMatrix(matrixDot(z, r3_4_proj), 'R3_4', 't4');

// console.log('R4_5 --------------------------------------------------');
printMatrix(matrixDot(z, r4_5_proj), 'R4_5', 't5');

// console.log('R5_6 --------------------------------------------------');
printMatrix(matrixDot(z, r5_6_proj), 'R5_6', 't6');

// From output above

// prettier-ignore
const R0_1 = [
  [Math.cos(t1),0,Math.sin(t1)],
  [Math.sin(t1),0,-Math.cos(t1)],
  [0,1,0]
]
// prettier-ignore
const R1_2 = [
  [-Math.sin(t2),-Math.cos(t2),0],
  [Math.cos(t2),-Math.sin(t2),0],
  [0,0,1]
]

// prettier-ignore
const R2_3 = [
  [Math.sin(t3),0,Math.cos(t3)],
  [-Math.cos(t3),0,Math.sin(t3)],
  [0,-1,0]
]

// prettier-ignore
const R3_4 = [
  [Math.cos(t4),0,Math.sin(t4)],
  [Math.sin(t4),0,-Math.cos(t4)],
  [0,1,0]
]

// prettier-ignore
const R4_5 = [
  [Math.cos(t5),0,-Math.sin(t5)],
  [Math.sin(t5),0,Math.cos(t5)],
  [0,-1,0]
]

// prettier-ignore
const R5_6 = [
  [Math.cos(t6),-Math.sin(t6),0],
  [Math.sin(t6),Math.cos(t6),0],
  [0,0,1],
]

console.log('R0_1 --------------------------------------------------');
printMatrix(R0_1);
console.log('R1_2 --------------------------------------------------');
printMatrix(R1_2);
console.log('R2_3 --------------------------------------------------');
printMatrix(R2_3);
console.log('R3_4 --------------------------------------------------');
printMatrix(R3_4);
console.log('R4_5 --------------------------------------------------');
printMatrix(R4_5);
console.log('R5_6 --------------------------------------------------');
printMatrix(R5_6);

const R0_2 = matrixDot(R0_1, R1_2);
const R2_4 = matrixDot(R2_3, R3_4);
const R4_6 = matrixDot(R4_5, R5_6);
const R0_4 = matrixDot(R0_2, R2_4);
const R0_6 = matrixDot(R0_4, R4_6);

console.log('R0_2 --------------------------------------------------');
printMatrix(R0_2);

console.log('R2_4 --------------------------------------------------');
printMatrix(R2_4);

console.log('R4_6 --------------------------------------------------');
printMatrix(R4_6);

console.log('R0_4 --------------------------------------------------');
printMatrix(R0_4);

console.log('R0_6 --------------------------------------------------');
printMatrix(R0_6);
