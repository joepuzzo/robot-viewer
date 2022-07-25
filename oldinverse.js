// OG ---------------

const inverse = (x, y, z, robotConfig) => {
  // ----------------------------------------------------------------
  // Step1 find inverse kinimatics for 1-3
  const [angle1, angle2, angle3] = inverse1_3(x, y, z, robotConfig);

  console.log('inverse1_3 --------------------------------------------------');
  console.log('Angles:', [angle1, angle2, angle3]);

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

  console.log('r0_3 --------------------------------------------------');
  printMatrix(r0_3);

  // Inverse of
  const inv_r0_3 = inv(r0_3);

  console.log('inv_r0_3 --------------------------------------------------');
  printMatrix(inv_r0_3);

  // Fixed for now
  // const r0_6 = [
  //   // x6 y6 z6
  //   [0, 0, -1],
  //   [0, 1, 0],
  //   [1, 0, 0],
  // ];

  // const r0_6 = [
  //   // x6 y6 z6
  //   [0, 0, -1],
  //   [0, 1, 0],
  //   [-1, 0, 0],
  // ];

  const r0_6 = [
    // x6 y6 z6
    [-1, 0, 0],
    [0, -1, 0],
    [0, 0, -1],
  ];

  console.log('r0_6 --------------------------------------------------');
  printMatrix(r0_6);

  const r3_6 = matrixDot(inv_r0_3, r0_6);

  console.log('r3_6 --------------------------------------------------');
  printMatrix(r3_6);

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
    'Math.acos(r3_6[2][0] / Math.sin(angle5))',
    Math.sin(angle5) === 0 ? 0 : Math.acos(r3_6[2][0] / Math.sin(angle5))
  );

  const angle6 = Math.sin(angle5) === 0 ? 0 : Math.acos(r3_6[2][0] / Math.sin(angle5));
  const angle4 = Math.sin(angle5) === 0 ? 0 : Math.acos(r3_6[0][2] / -Math.sin(angle5));

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

  console.log('r3_6_check --------------------------------------------------');
  printMatrix(r3_6_check);

  // Step4 do forward kinimatics on the last three joints and get the rotation part

  // Step5 specify the rotation matrix of R0_6 to be

  // Step6 given a desired xyz pos solve for the first three joints

  return [angle1, angle2, angle3, angle4, angle5, angle6];
};

// ------ V2

const inverse = (x, y, z, robotConfig) => {
  // ----------------------------------------------------------------
  // T take the inverse of R0_3
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

  console.log('r0_3 --------------------------------------------------');
  printMatrix(r0_3);

  // Inverse of
  const inv_r0_3 = inv(r0_3);

  console.log('inv_r0_3 --------------------------------------------------');
  printMatrix(inv_r0_3);

  // Fixed for now
  const r0_6 = [
    // x6 y6 z6
    [-1, 0, 0],
    [0, -1, 0],
    [0, 0, -1],
  ];

  console.log('r0_6 --------------------------------------------------');
  printMatrix(r0_6);

  const r3_6 = matrixDot(inv_r0_3, r0_6);

  console.log('r3_6 --------------------------------------------------');
  printMatrix(r3_6);

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
    'Math.acos(r3_6[2][0] / Math.sin(angle5))',
    Math.sin(angle5) === 0 ? 0 : Math.acos(r3_6[2][0] / Math.sin(angle5))
  );

  const angle6 = Math.sin(angle5) === 0 ? 0 : Math.acos(r3_6[2][0] / Math.sin(angle5));
  const angle4 = Math.sin(angle5) === 0 ? 0 : Math.acos(r3_6[0][2] / -Math.sin(angle5));

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

  console.log('r3_6_check --------------------------------------------------');
  printMatrix(r3_6_check);

  // Do forward kinimatics on the last three joints and get the x3_6, y3_6, and z3_6

  // Define the table
  const pt3_6 = [
    [angle4, d90, 0, v2 + v3],
    [angle5, -d90, 0, 0],
    [angle6, 0, 0, v4 + v5],
  ];

  // Find the end matrix ( dot product )
  const { endMatrix: h3_6 } = buildHomogeneousDenavitForTable(pt3_6);

  console.log('h3_6 --------------------------------------------------');
  printMatrix(h3_6);

  // Find the x y and z for 3_6
  const x3_6 = h3_6[0][3];
  const y3_6 = h3_6[1][3];
  const z3_6 = h3_6[2][3];

  // Now we need to get x0_3 y0_3 and z0_3
  // x0_6 = x0_3 + x3_6
  // therefore
  // x0_3 = x0_6 - x3_6
  const x0_3 = x - x3_6;
  const y0_3 = y - y3_6;
  const z0_3 = z - z3_6;

  // ----------------------------------------------------------------
  // Find find inverse kinimatics for 1-3 using the pos we got (x0_3 y0_3 z0_3)
  const [angle1, angle2, angle3] = inverse1_3(x0_3, y0_3, z0_3, robotConfig);

  console.log('inverse1_3 --------------------------------------------------');
  console.log('Angles:', [angle1, angle2, angle3]);

  return [angle1, angle2, angle3, angle4, angle5, angle6];
};

// ------------- V3

const inverse = (x, y, z, robotConfig) => {
  /**      pc = wrist center
   *      ( )
   *      / \
   *     /   \ v4
   *    /     \
   *  [ ]     [ ]
   *            \ v5
   *             \
   *             pe
   *
   * goal: find the x,y,z for
   *
   * pc = pe - (v4 + v5) * z6
   */

  const pe = [[x], [y], [z]];

  // ----------------------------------------------------------------
  // T take the inverse of R0_3
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

  console.log('r0_3 --------------------------------------------------');
  printMatrix(r0_3);

  // Inverse of
  const inv_r0_3 = inv(r0_3);

  console.log('inv_r0_3 --------------------------------------------------');
  printMatrix(inv_r0_3);

  // Fixed for now
  const r0_6 = [
    // x6 y6 z6
    [-1, 0, 0],
    [0, -1, 0],
    [0, 0, -1],
  ];

  console.log('r0_6 --------------------------------------------------');
  printMatrix(r0_6);

  const r3_6 = matrixDot(inv_r0_3, r0_6);

  console.log('r3_6 --------------------------------------------------');
  printMatrix(r3_6);

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
    'Math.acos(r3_6[2][0] / Math.sin(angle5))',
    Math.sin(angle5) === 0 ? 0 : Math.acos(r3_6[2][0] / Math.sin(angle5))
  );

  const angle6 = Math.sin(angle5) === 0 ? 0 : Math.acos(r3_6[2][0] / Math.sin(angle5));
  const angle4 = Math.sin(angle5) === 0 ? 0 : Math.acos(r3_6[0][2] / -Math.sin(angle5));

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

  console.log('r3_6_check --------------------------------------------------');
  printMatrix(r3_6_check);

  // Do forward kinimatics on the last three joints and get the x3_6, y3_6, and z3_6

  // Define the table
  const pt3_6 = [
    [angle4, d90, 0, v2 + v3],
    [angle5, -d90, 0, 0],
    [angle6, 0, 0, v4 + v5],
  ];

  // Find the end matrix ( dot product )
  const { endMatrix: h3_6 } = buildHomogeneousDenavitForTable(pt3_6);

  console.log('h3_6 --------------------------------------------------');
  printMatrix(h3_6);

  // Find the x y and z for 3_6
  const x3_6 = h3_6[0][3];
  const y3_6 = h3_6[1][3];
  const z3_6 = h3_6[2][3];

  // Now we need to get x0_3 y0_3 and z0_3
  // x0_6 = x0_3 + x3_6
  // therefore
  // x0_3 = x0_6 - x3_6
  const x0_3 = x - x3_6;
  const y0_3 = y - y3_6;
  const z0_3 = z - z3_6;

  // ----------------------------------------------------------------
  // Find find inverse kinimatics for 1-3 using the pos we got (x0_3 y0_3 z0_3)
  const [angle1, angle2, angle3] = inverse1_3(x0_3, y0_3, z0_3, robotConfig);

  console.log('inverse1_3 --------------------------------------------------');
  console.log('Angles:', [angle1, angle2, angle3]);

  return [angle1, angle2, angle3, angle4, angle5, angle6];
};
