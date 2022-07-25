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

import { inv } from 'mathjs';

const toRadians = (deg) => {
  return (deg / 180) * Math.PI;
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

const round = (n) => Math.round(n * 1000000) / 1000000;

const roundOne = (n) => {
  let r = n;
  if (r > 1) {
    return 1;
  }

  if (r < -1) {
    return -1;
  } else return r;
};

function matrixDot(a, b) {
  var result = new Array(a.length).fill(0).map((row) => new Array(b[0].length).fill(0));

  return result.map((row, i) => {
    return row.map((val, j) => {
      return round(a[i].reduce((sum, elm, k) => sum + elm * b[k][j], 0));
    });
  });
}

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

const d90 = toRadians(90);

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

export const inverse = (x, y, z, robotConfig) => {
  // Fixed for now ( up )
  const r0_6 = [
    // x6 y6 z6
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ];

  const { a1, a2, a3, a4, a5, a6 } = robotConfig;

  /**
   *
   * First we need fo find the x0_3, y0_3 and Z0_3
   *
   *       wc = wrist center vector
   *      ( )
   *      / \
   *     /   \ v4
   *    /     \
   *  [ ]     [ ]
   *            \ v5
   *             \
   *             ef = end effector vector
   *
   * goal: find the x,y,z for
   *
   * wc = ef - (v4 + v5) * R0_6
   *
   * or
   *
   * vector0_3 = vector0_6 - wrist_offset_vector * R0_6
   */

  const rotatedVector = matrixDot(r0_6, [[0], [0], [a5 + a6]]);

  // console.log('rotatedVector', rotatedVector);

  const x0_3 = x - rotatedVector[0][0];
  const y0_3 = y - rotatedVector[1][0];
  const z0_3 = z - rotatedVector[2][0];

  console.log('x0_3, y0_3, z0_3', x0_3, y0_3, z0_3);

  // ----------------------------------------------------------------
  // Step1 find inverse kinimatics for 1-3

  const robotConfig1_3 = {
    a1,
    a2,
    a3: a3 + a4, // Our point includes joint 4 because we want location to wrist center,
  };
  const [angle1, angle2, angle3] = inverse1_3(x0_3, y0_3, z0_3, robotConfig1_3);

  // console.log('inverse1_3 --------------------------------------------------');
  // console.log('Angles:', [angle1, angle2, angle3]);

  // ----------------------------------------------------------------
  // Step2 build the transformatin matrix for 1-3
  const PT_0_3 = [
    [angle1, d90, 0, a1],
    [angle2 + d90, 0, a2, 0],
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

  // console.log('r0_3 --------------------------------------------------');
  // printMatrix(r0_3);

  // Inverse of
  const inv_r0_3 = inv(r0_3);

  // console.log('inv_r0_3 --------------------------------------------------');
  // printMatrix(inv_r0_3);

  // console.log('r0_6 --------------------------------------------------');
  // printMatrix(r0_6);

  const r3_6 = matrixDot(inv_r0_3, r0_6);

  // console.log('r3_6 --------------------------------------------------');
  // printMatrix(r3_6);

  /**
   *
   * We use our special functions to create the matrix for r3_6
   * from this we can start to define functions!
   *
   *  const r3_6 = [
   *    [ a, b, c ],
   *    [ d, e, f ],
   *    [ g, h, i ]
   *  ]
   *
   *  const r3_6 = [
   *    [Math.cos(t4) * Math.cos(t5) * Math.cos(t6) + -Math.sin(t4) * Math.sin(t6),Math.cos(t4) * Math.cos(t5) * -Math.sin(t6) + -Math.sin(t4) * Math.cos(t6),Math.cos(t4) * -Math.sin(t5)],
   *    [Math.sin(t4) * Math.cos(t5) * Math.cos(t6) + Math.cos(t4) * Math.sin(t6),Math.sin(t4) * Math.cos(t5) * -Math.sin(t6) + Math.cos(t4) * Math.cos(t6),Math.sin(t4) * -Math.sin(t5)],
   *    [Math.sin(t5) * Math.cos(t6),Math.sin(t5) * -Math.sin(t6),Math.cos(t5)],
   *  ]
   *
   *  therefore
   *
   *  i = Math.cos(t5)
   *
   *  t5 = Math.acos(r3_6[2][2])
   *
   *  -----------------------------
   *
   *  g = Math.sin(t5) * Math.cos(t6)
   *
   *  t6 = Math.acos( r3_6[2][0] / Math.sin(t5) )
   *
   *  -----------------------------
   *
   *  c = Math.cos(t4) * -Math.sin(t5)
   *  c / -Math.sin(t5) = Math.cos(t4)
   *  Math.acos( c / -Math.sin(t5) ) = t4
   *
   *  t4 = Math.acos( c / -Math.sin(t5) )
   *
   */

  const angle5 = Math.acos(r3_6[2][2]);

  console.log('r3_6[2][0]', r3_6[2][0]);
  console.log(`Math.sin(${angle5})'`, Math.sin(angle5));
  console.log(
    'Math.acos(roundOne(r3_6[2][0] / Math.sin(angle5)))',
    Math.sin(angle5) === 0 ? 0 : Math.acos(roundOne(r3_6[2][0] / Math.sin(angle5)))
  );

  const angle6 = Math.sin(angle5) === 0 ? 0 : Math.acos(roundOne(r3_6[2][0] / Math.sin(angle5)));
  const angle4 = Math.sin(angle5) === 0 ? 0 : Math.acos(roundOne(r3_6[0][2] / -Math.sin(angle5)));

  // Check r3_6

  const r3_6_check = [
    [
      Math.cos(angle4) * Math.cos(angle5) * Math.cos(angle6) + -Math.sin(angle4) * Math.sin(angle6),
      Math.cos(angle4) * Math.cos(angle5) * -Math.sin(angle6) +
        -Math.sin(angle4) * Math.cos(angle6),
      Math.cos(angle4) * -Math.sin(angle5),
    ],
    [
      Math.sin(angle4) * Math.cos(angle5) * Math.cos(angle6) + Math.cos(angle4) * Math.sin(angle6),
      Math.sin(angle4) * Math.cos(angle5) * -Math.sin(angle6) + Math.cos(angle4) * Math.cos(angle6),
      Math.sin(angle4) * -Math.sin(angle5),
    ],
    [Math.sin(angle5) * Math.cos(angle6), Math.sin(angle5) * -Math.sin(angle6), Math.cos(angle5)],
  ];

  // console.log('r3_6_check --------------------------------------------------');
  // printMatrix(r3_6_check);
  // TODO maybe actually check this

  return [angle1, angle2, angle3, angle4, angle5, angle6];
};
