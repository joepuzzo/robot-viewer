import { inv } from 'mathjs';
import { toRadians } from './toRadians';
import { roundOne } from './round';
import { matrixSubset } from './matrixSubset';
import { matrixDot } from './matrixDot';
import { buildHomogeneousDenavitForTable } from './denavitHartenberg';
import { inverse1_3 } from './inverse1_3';
import { Debug } from './debug';
import { zxz } from './euler';
import { cleanAndRoundMatrix } from './roundMatrix';

const logger = Debug('ik:inverse' + '\t');

const d90 = toRadians(90);

// ---------------------------- Now we have everything we need to write our inverse function!!!

/**
 * https://www.youtube.com/watch?v=ZM9GOENJcuo
 *
 * @param {*} x
 * @param {*} y
 * @param {*} z
 * @param {*} robotConfig
 * @returns
 */
export const inverse = (x, y, z, r1, r2, r3, robotConfig) => {
  const r0_6 = cleanAndRoundMatrix(zxz(r1, r2, r3));

  // console.table(r0_6);

  // Fixed for now ( up )
  // const r0_6 = [
  //   // x6 y6 z6
  //   [1, 0, 0],
  //   [0, 1, 0],
  //   [0, 0, 1],
  // ];

  // Get lengths of all verticies between joints
  const { a1, a2, a3, a4, a5, a6 } = robotConfig;

  // ----------------------------------------------------------------------------------
  // Step1 find the x0_3, y0_3 and Z0_3 based on end effector

  /**
   *  https://youtu.be/NDEEKGEQylg?t=1439
   *  https://www.youtube.com/watch?v=Is50EWYF99I&t=570s
   *
   * We need fo find the x0_3, y0_3 and Z0_3
   *
   *         wc = wrist center vector
   *        ( )
   *        / \
   *       /   \ a5
   *      /     \
   *    [ ]     [ ]
   *     |         \ a6
   *    ( )         \
   *     |          ef = end effector vector
   *    ( )
   *     |
   *    [ ]
   *
   * goal: find the x, y, z for the wrist centerpoint
   *
   * wc = ef - (a5 + a6) * R0_6
   *
   * or
   *
   * vector0_3 = vector0_6 - wrist_offset_vector * R0_6
   */

  const rotatedVector = matrixDot(r0_6, [[0], [0], [a5 + a6]]);

  logger('rotatedVector', rotatedVector);

  const x0_3 = x - rotatedVector[0][0];
  const y0_3 = y - rotatedVector[1][0];
  const z0_3 = z - rotatedVector[2][0];

  logger('x0_3, y0_3, z0_3', x0_3, y0_3, z0_3);

  // ----------------------------------------------------------------------------------
  // Step2 find inverse kinimatics for 1-3 using the x0_3, y0_3, z0_3 we just obtained

  const robotConfig1_3 = {
    a1,
    a2,
    a3: a3 + a4, // Our point includes joint 4 because we want location to wrist center,
  };
  const [angle1, angle2, angle3] = inverse1_3(x0_3, y0_3, z0_3, robotConfig1_3);

  logger('inverse1_3 --------------------------------------------------');
  logger('Angles:', [angle1, angle2, angle3]);

  // ----------------------------------------------------------------
  // Step3 build the transformatin matrix for 1-3
  const PT_0_3 = [
    [angle1, d90, 0, a1],
    [angle2 + d90, 0, a2, 0],
    [angle3 - d90, -d90, 0, 0],
  ];

  const { endMatrix: h0_3 } = buildHomogeneousDenavitForTable(PT_0_3);

  // ----------------------------------------------------------------
  // Step4 take the inverse of R0_3
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

  logger('r0_3 --------------------------------------------------');
  logger.table(r0_3);

  // Inverse of
  const inv_r0_3 = inv(r0_3);

  logger('inv_r0_3 --------------------------------------------------');
  logger.table(inv_r0_3);

  logger('r0_6 --------------------------------------------------');
  logger.table(r0_6);

  const r3_6 = matrixDot(inv_r0_3, r0_6);

  logger('r3_6 --------------------------------------------------');
  logger.table(r3_6);

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

  logger('r3_6[2][0]', r3_6[2][0]);
  logger(`Math.sin(${angle5})'`, Math.sin(angle5));
  logger(
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

  // logger('r3_6_check --------------------------------------------------');
  // printMatrix(r3_6_check);
  // TODO maybe actually check this

  // Return angles removing negative zeros
  return [angle1, angle2, angle3, angle4, angle5, angle6].map((a) => (Object.is(a, -0) ? 0 : a));
};
