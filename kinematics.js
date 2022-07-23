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

// import { inv } from 'mathjs';

const toRadians = (deg) => {
  return (deg / 180) * Math.PI;
};

const toDeg = (rad) => {
  return 180 * (rad / Math.PI);
};

/**
 * matrixSubset
 *
 * @param {*} m - the matrix
 * @param {*} cols - the number of columns we want
 * @param {*} rows - the number of rows we want
 * @returns a subset of the original matrix
 */
const matrixSubset = (m, cols, rows) => {
  const subset = [];

  for (let i = 0; i < rows; i++) {
    subset[i] = m[i].slice(0, cols);
  }

  return subset;
};

// https://gist.github.com/husa/5652439
function inverseMatrix(matrix) {
  const _A = JSON.parse(JSON.stringify(matrix));

  var temp,
    N = _A.length,
    E = [];

  for (var i = 0; i < N; i++) E[i] = [];

  for (i = 0; i < N; i++)
    for (var j = 0; j < N; j++) {
      E[i][j] = 0;
      if (i == j) E[i][j] = 1;
    }

  for (var k = 0; k < N; k++) {
    temp = _A[k][k];

    for (var j = 0; j < N; j++) {
      _A[k][j] /= temp;
      E[k][j] /= temp;
    }

    for (var i = k + 1; i < N; i++) {
      temp = _A[i][k];

      for (var j = 0; j < N; j++) {
        _A[i][j] -= _A[k][j] * temp;
        E[i][j] -= E[k][j] * temp;
      }
    }
  }

  for (var k = N - 1; k > 0; k--) {
    for (var i = k - 1; i >= 0; i--) {
      temp = _A[i][k];

      for (var j = 0; j < N; j++) {
        _A[i][j] -= _A[k][j] * temp;
        E[i][j] -= E[k][j] * temp;
      }
    }
  }

  for (var i = 0; i < N; i++) for (var j = 0; j < N; j++) _A[i][j] = E[i][j];
  return _A;
}

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

const round = (n) => Math.round(n * 100) / 100;

function matrixDot(a, b) {
  var result = new Array(a.length).fill(0).map((row) => new Array(b[0].length).fill(0));

  return result.map((row, i) => {
    return row.map((val, j) => {
      return round(a[i].reduce((sum, elm, k) => sum + elm * b[k][j], 0));
    });
  });
}

let t1 = 0; // Theta 1 angle in degrees
let t2 = 90; // Theta 2 angle in degrees
let t3 = -90; // Theta 3 angle in degrees
let t4 = 0; // Theta 4 angle in degrees
let t5 = 0; // Theta 5 angle in degrees
let t6 = 0; // Theta 6 angle in degrees

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

let test1 = 10;
let test2 = 70;

test1 = toRadians(test1);
test2 = toRadians(test2);

printMatrix(matrixDot(z, identityMatrix), 'Test_R0_1', 'test1');
printMatrix(matrixDot(z, identityMatrix), 'Test_R1_2', 'test2');

// From output above ----------------------

// prettier-ignore
const Test_R0_1 = [
  [Math.cos(test1),-Math.sin(test1),0],
  [Math.sin(test1),Math.cos(test1),0],
  [0,0,1],
]

// prettier-ignore
const Test_R1_2 = [
  [Math.cos(test2),-Math.sin(test2),0],
  [Math.sin(test2),Math.cos(test2),0],
  [0,0,1],
]

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

const TestR0_2 = matrixDot(Test_R0_1, Test_R1_2);

const R0_2 = matrixDot(R0_1, R1_2);
const R2_4 = matrixDot(R2_3, R3_4);
const R4_6 = matrixDot(R4_5, R5_6);
const R0_3 = matrixDot(R0_2, R2_3);
const R0_4 = matrixDot(R0_2, R2_4);
const R0_6 = matrixDot(R0_4, R4_6);
const R3_6 = matrixDot(R3_4, R4_6);

console.log('Test_R0_1 --------------------------------------------------');
printMatrix(Test_R0_1);

console.log('Test_R1_2 --------------------------------------------------');
printMatrix(Test_R1_2);

console.log('TestR0_2 --------------------------------------------------');
printMatrix(TestR0_2);

console.log('R0_2 --------------------------------------------------');
printMatrix(R0_2);

console.log('R2_4 --------------------------------------------------');
printMatrix(R2_4);

console.log('R4_6 --------------------------------------------------');
printMatrix(R4_6);

console.log('R0_3 --------------------------------------------------');
printMatrix(R0_3);

console.log('R3_6 --------------------------------------------------');
printMatrix(R3_6);

console.log('R0_4 --------------------------------------------------');
printMatrix(R0_4);

console.log('R0_6 --------------------------------------------------');
printMatrix(R0_6);

// Now its time to define some displacement transformations

const v0 = 1;
const v1 = 1;
const v2 = 1;
const v3 = 1;
const v4 = 1;
const v5 = 1;

// const a1 = 1;
// const a2 = 1;
// const a3 = 1;
// const a4 = 1;

// prettier-ignore
// const Testd0_1 = [
//   [a2 * Math.cos(test1)],
//   [a2 * Math.sin(test1)],
//   [a1],
// ];

// // prettier-ignore
// const Testd1_2 = [
//   [a4 * Math.cos(test2)],
//   [a4 * Math.sin(test2)],
//   [a3],
// ];

// prettier-ignore
const d0_1 = [
  [0],
  [0],
  [v0]
];

// prettier-ignore
const d1_2 = [
  [v1 * -Math.sin(t2)],
  [v1 * Math.cos(t2)],
  [0]
];

// prettier-ignore
const d2_3 = [
  [0],
  [0],
  [0]
];

// prettier-ignore
const d3_4 = [
  [0],
  [0],
  [v2 + v3]
]

// prettier-ignore
const d4_5 = [
  [0],
  [0],
  [0]
];

// prettier-ignore
const d5_6 = [
  [0],
  [0],
  [v4 + v5]
]

// Now its time to make some Homogeneous Transformations!!!!

const buildHomogeneous = (r, d) => {
  return [
    [...r[0], ...d[0]],
    [...r[1], ...d[1]],
    [...r[2], ...d[2]],
    [0, 0, 0, 1],
  ];
};

// const TestH0_1 = buildHomogeneous(Test_R0_1, Testd0_1);
// const TestH1_2 = buildHomogeneous(Test_R1_2, Testd1_2);

const H0_1 = buildHomogeneous(R0_1, d0_1);
const H1_2 = buildHomogeneous(R1_2, d1_2);
const H2_3 = buildHomogeneous(R2_3, d2_3);
const H3_4 = buildHomogeneous(R3_4, d3_4);
const H4_5 = buildHomogeneous(R4_5, d4_5);
const H5_6 = buildHomogeneous(R5_6, d5_6);

// const TestH0_2 = matrixDot(TestH0_1, TestH1_2);

// console.log('TestH0_1 --------------------------------------------------');
// printMatrix(TestH0_1);
// console.log('TestH1_2 --------------------------------------------------');
// printMatrix(TestH1_2);
// console.log('TestH0_2 --------------------------------------------------');
// printMatrix(TestH0_2);

console.log('H0_1 --------------------------------------------------');
printMatrix(H0_1);
console.log('H1_2 --------------------------------------------------');
printMatrix(H1_2);
console.log('H2_3 --------------------------------------------------');
printMatrix(H2_3);
console.log('H3_4 --------------------------------------------------');
printMatrix(H3_4);
console.log('H4_5 --------------------------------------------------');
printMatrix(H4_5);
console.log('H5_6 --------------------------------------------------');
printMatrix(H5_6);

const H0_2 = matrixDot(H0_1, H1_2);
const H0_3 = matrixDot(H0_2, H2_3);
const H2_4 = matrixDot(H2_3, H3_4);
const H4_6 = matrixDot(H4_5, H5_6);
const H0_4 = matrixDot(H0_2, H2_4);
const H0_6 = matrixDot(H0_4, H4_6);

console.log('H0_2 --------------------------------------------------');
printMatrix(H0_2);

console.log('H2_4 --------------------------------------------------');
printMatrix(H2_4);

console.log('H0_3 --------------------------------------------------');
printMatrix(H0_3);

console.log('H0_4 --------------------------------------------------');
printMatrix(H0_4);

console.log('H0_6 --------------------------------------------------');
printMatrix(H0_6);

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

const buildHomogeneousDenavitForRow = (row) => {
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

const buildHomogeneousDenavitForTable = (pt) => {
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

console.log('-------------------------Denavit Hartenberg-------------------------------');

// For testing against you tube video our numbers are good!
//
// const d1 = 1;
// const d2 = 1;
// const d3 = 1;
// const PT = [
//   [toRadians(90), toRadians(90), 0, a1 + d1],
//   [toRadians(90), -toRadians(90), 0, a2 + d2],
//   [0, 0, 0, a3 + d3],
// ];

// const res = buildHomogeneousDenavitForTable(PT);

// console.log('H0_1 --------------------------------------------------');
// printMatrix(res.matriceis[0]);
// console.log('H1_2 --------------------------------------------------');
// printMatrix(res.matriceis[1]);
// console.log('H2_3 --------------------------------------------------');
// printMatrix(res.matriceis[2]);
// console.log('H0_3 --------------------------------------------------');
// printMatrix(res.endMatrix);

// t   a   r   d
const d90 = toRadians(90);

// prettier-ignore
const PT = [
  [ t1, d90, 0, v0 ],
  [ t2+d90, 0, v1, 0 ],
  [ t3-d90, -d90, 0, 0 ],
  [ t4, d90, 0, v2 + v3 ],
  [ t5, -d90, 0, 0 ],
  [ t6, 0, 0, v4 + v5 ]
];

console.log('PT --------------------------------------------------');
printMatrix(PT);

const res = buildHomogeneousDenavitForTable(PT);

console.log('H0_1 --------------------------------------------------');
printMatrix(res.matriceis[0]);
console.log('H1_2 --------------------------------------------------');
printMatrix(res.matriceis[1]);
console.log('H2_3 --------------------------------------------------');
printMatrix(res.matriceis[2]);
console.log('H3_4 --------------------------------------------------');
printMatrix(res.matriceis[3]);
console.log('H4_5 --------------------------------------------------');
printMatrix(res.matriceis[4]);
console.log('H5_6 --------------------------------------------------');
printMatrix(res.matriceis[5]);
// console.log('H0_3 --------------------------------------------------');
// printMatrix(res.h0_3);
// console.log('H3_6 --------------------------------------------------');
// printMatrix(res.h3_6);
console.log('H0_6 --------------------------------------------------');
printMatrix(res.endMatrix);
/**
 * Useful things
 *
 * 1. Pythagorean Theorum
 * Math.pow(a, 2) + Math.pow(b, 2) = Math.pow(c, 2)
 *
 *        /|
 *     c / |
 *      /t | b
 *     /___|
 *       a
 *
 * 2. SOHCAHTOA
 *
 * 3. Law of cosines
 *
 * Math.pow(c, 2) = Math.pow(a, 2) + Math.pow(b, 2) - 2 * a * b * Math.cos( alpha )
 *
 * where c is angle opposite side c
 *
 *        /\
 *     a /  \ c
 *      /    \
 *     /)_ _ _\
 *         b
 *
 *
 * Using above we are ging to do reverse kinimatics on 1-3
 *
 * The joints will be reffered to as j0 j1 and j2 respectivley
 *
 *  ---------- SideView ----------
 *              .            .
 *               \          |
 *             a3 \ t3      |
 *                ( )       |
 *                /         |
 *               /          |
 *              /           |
 *          a2 /            | z0_3
 *            / t2          |
 *          ( )---          |
 *   z       |              |
 *   |    a1 |              |
 *   | y     |              |
 *   |/___x [ ]             .
 *
 *
 *   ---- Useful Triangles ----
 *
 * Below depicts J1 -- J2
 *                            _
 *                          _ _ |
 *                        _  _  |
 *                      _   _   |
 *                    _    _    |
 *                  _     _ a3  |
 *           r3   _      _      |
 *              _       _       |
 *            _          \->t3  | r2
 *          _     p3 ( )        |
 *        _       _             |
 *      _   \  _  a2            |
 *    _\ p1 _\                  |
 *  _   \_    \ -> p2           |
 *   ( ) \->t2 \                |
 * -----------------------------
 *              r1
 *
 *
 *  -------- TopDownView --------
 *             .           y0_3
 *            /             |
 *           /              |
 *     r1  [ ]              |
 *         /                |
 *        /                 |
 *       / t1               |
 *     ( )                  |
 *      _ _ _ _ _ _ _ _ _x0_3
 *
 *
 * Goal: our goal is to derrive equasions for each theta for joints 1-3
 */

// ---------- Compute t1 ----------

const computeT1 = (x0_3, y0_3) => {
  return Math.atan2(y0_3, x0_3);
};

// ---------- Compute t2 ----------

/**
 * t2 = p2 - p1
 *
 * -- first we need to get p2
 *
 * p2 = Math.atan( r2 / r1 )
 *
 * r2 = z0_3 - a1
 *
 * Taken from looking at top view
 * r1 = Math.sqrt( Math.pow(x0_3, 2) + Math.pow( y0_3, 2 ) )
 *
 * -- now we need to get p1
 *
 * 1. we need r3 as a known variable
 *
 *  r3 = Math.sqrt( Math.pow(r1, 2) + Math.pow( r2, 2 ) )
 *
 * 2. Re arrange law of cosines
 *
 * Math.pow(a3, 2) = Math.pow(a2, 2) + Math.pow(r3, 2) - 2 * a2 * r3 * Math.cos( p1 )
 * p1 = Math.acos( ( Math.pow(a3, 2) - Math.pow(a2, 2) - Math.pow(r3, 2) ) / ( -2 * a2 * r3 )  )
 *
 */
const computeR1 = (x0_3, y0_3) => {
  return Math.sqrt(Math.pow(x0_3, 2) + Math.pow(y0_3, 2));
};

const computeR2 = (z0_3, a1) => {
  return z0_3 - a1;
};

const computeP2 = (r2, r1) => {
  return Math.atan2(r2, r1);
};

const computeR3 = (r1, r2) => {
  return Math.sqrt(Math.pow(r1, 2) + Math.pow(r2, 2));
};

const computeP1 = (a2, a3, r3) => {
  return Math.acos((Math.pow(a3, 2) - Math.pow(a2, 2) - Math.pow(r3, 2)) / (-2 * a2 * r3));
};

const computeT2 = (p1, p2) => {
  return p2 - p1;
};

// ---------- Compute t3 ----------

const computeP3 = (a2, a3, r3) => {
  return Math.acos((Math.pow(r3, 2) - Math.pow(a2, 2) - Math.pow(a3, 2)) / (-2 * a2 * a3));
};

const computeT3 = (p3) => {
  return Math.PI - p3;
};

// -------- Inverse Function ---------

const config = {
  a1: v0,
  a2: v1,
  a3: v2,
};

const inverse1_3 = (x, y, z, robotConfig) => {
  const { a1, a2, a3 } = robotConfig;

  const r1 = computeR1(x, y);
  console.log('r1', r1);
  const r2 = computeR2(z, a1);
  console.log('r2', r2);
  const p2 = computeP2(r1, r2);
  console.log('p2', p2);
  const r3 = computeR3(r1, r2);
  console.log('r3', r3);
  const p1 = computeP1(a2, a3, r3);
  console.log('p1', p1);
  const p3 = computeP3(a2, a3, r3);
  console.log('p3', p3);

  const t1 = computeT1(x, y);
  const t2 = computeT2(p1, p2);
  const t3 = computeT3(p3);

  return [t1, t2, t3];
};

const result = inverse1_3(2, 0, 1, config);

console.log(
  'RES',
  result.map((a) => toDeg(a))
);

const inverse = (x, y, z, robotConfig) => {
  // ----------------------------------------------------------------
  // Step1 find inverse kinimatics for 1-3
  const [angle1, angle2, angle3] = inverse1_3(x, y, z, robotConfig);

  // ----------------------------------------------------------------
  // Step2 build the transformatin matrix for 1-3
  const PT_0_3 = [
    [angle1, d90, 0, v0],
    [angle2 + d90, 0, v1, 0],
    [angle3 - d90, -d90, 0, 0],
  ];

  const { endMatrix: h0_3 } = buildHomogeneousDenavitForTable(PT_0_3);

  // ----------------------------------------------------------------
  // Step3 take the inverse of R0_3
  //
  // Background:
  //
  // R0_6 = R0_3 * R3_6
  //
  // therefore
  //
  // R3_6 = inverseMatrix(R0_3) * R0_6

  // we only need to inverse the rotational part so get that
  const r0_3 = matrixSubset(h0_3, 3, 3);
  const inv_r0_3 = inverseMatrix(r0_3);

  // Step4 find R3_6

  const PT_3_6 = [
    [t4, d90, 0, v2 + v3],
    [t5, -d90, 0, 0],
    [t6, 0, 0, v4 + v5],
  ];

  // Step6 identify where we want

  // const { endMatrix: h0_3 } = buildHomogeneousDenavitForTable(PT);
};

// prettier-ignore
const test = [
  [1, 2, -1 ],
  [-2, 0, 1 ],
  [1, -1, 0 ]
]

// console.table(inv(test));
console.table(inverseMatrix(test));
console.table(test);

console.table(matrixSubset(test, 2, 3));
