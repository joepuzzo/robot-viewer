import { inv } from 'mathjs';
import { toRadians } from './toRadians';
import { round, roundOne } from './round';
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
  const { a1, a2, a3, a4, a5, a6, x0 = 0, flip } = robotConfig;

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

  logger('rotatedVector', JSON.stringify(rotatedVector));

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
    x0,
  };
  const [angle1, angle2, angle3] = inverse1_3(x0_3, y0_3, z0_3, robotConfig1_3);

  logger('inverse1_3 --------------------------------------------------');
  logger('inverse1_3_angles', [angle1, angle2, angle3]);

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
   * therefore
   *
   * https://www.youtube.com/watch?v=NDEEKGEQylg&t=2724s
   *
   * --------------------- angle4 ----------------------
   *
   * c = Math.cos(t4) * -Math.sin(t5)
   * f = Math.sin(t4) * -Math.sin(t5)
   *
   * f/c = ( Math.sin(t4) * -Math.sin(t5) ) / ( Math.cos(t4) * -Math.sin(t5) )
   *
   * -Math.sin(t5) cancel out so we are left with
   *
   * f/c =  Math.sin(t4) / Math.cos(t4)
   *
   * remember because all sides equal 1
   *
   * sin(t)	= opposite
   * cos(t)	= adjacent
   * tan(t)	= opposite / adjacent
   *
   * Math.tan( t4 ) = f / c
   *
   * t4 = Math.atan2(c, f)
   *
   *
   * --------------------- angle5 ----------------------
   *
   *
   * Math.atan2( Math.sqrt( Math.pow( c, 2 ) +  Math.pow( f, 2 ) ), i )
   *
   *
   * --------------------- angle6 ----------------------
   *
   * -h / g = -Math.sin(t6) / Math.cos(t6)
   *
   * t6 = Math.atan2( -h, g );
   *
   * ------ Old Below ------
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

  /**
   * const r3_6 = [
   *    [ a, b, c ],
   *    [ d, e, f ],
   *    [ g, h, i ]
   *  ]
   */

  const c = r3_6[0][2];
  const f = r3_6[1][2];
  const i = r3_6[2][2];
  const g = r3_6[2][0];
  const h = r3_6[2][1];

  logger('---------------------- CALC THETA 5 ------------------------------');
  // let angle5 = Math.acos(r3_6[2][2]); // OLD

  let angle5 = -Math.atan2(Math.sqrt(Math.pow(c, 2) + Math.pow(f, 2)), i);

  logger('angle5', angle5);

  logger('---------------------- CALC THETA 4 ------------------------------');
  // angle4 = Math.acos( c / -Math.sin(t5) ) // OLD
  let angle4 = Math.atan2(f, c);

  // Issue where it jumps from pi to negative pi sometimes
  angle4 = angle4 < 0 && round(angle4, 10000) === -round(Math.PI, 10000) ? Math.PI : angle4;

  logger('angle4', angle4);

  logger('---------------------- CALC THETA 6 ------------------------------');
  // let angle6 = Math.sin(angle5) === 0 ? 0 : Math.acos(roundOne(r3_6[2][0] / -Math.sin(angle5))); // OLD

  let angle6 = Math.atan2(-h, g);

  logger('angle6', angle6);

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
  // console.table(r3_6_check);
  // TODO maybe actually check this

  // Return angles removing negative zeros
  logger('Angles', [angle1, angle2, angle3, angle4, angle5, angle6]);

  /**
   * Ok so the following code is very wierd but it makes the angles that the kinimatics created much cleaner
   *
   * Basically depending on how big the angle is we flip it or take recipricals resulting in same location but again...
   * better angles
   *
   * Example:
   * Given: Angles  a4 = -158 a5 = -22 a6 = 158
   * Result: Angles a4 = 22   a5 = 22  a6 = -22
   */

  if (flip) {
    // 180 - 157 = 23
    const diff4 = Math.PI - Math.abs(angle4);
    const diff6 = Math.PI - Math.abs(angle6);

    // Flip reciprical of 4 and 6 && flip 5
    if (Math.abs(angle4) > Math.PI / 2 && Math.abs(angle6) > Math.PI / 2) {
      // console.log('HERE1', angle4, angle5, angle6);
      if (angle4 != 0) {
        angle4 = angle4 < 0 ? diff4 : -diff4;
      }
      angle5 = angle5 * -1;
      if (angle6 != 0 && round(angle4, 10000) != 0) angle6 = angle6 < 0 ? diff6 : -diff6;
    } else if (Math.abs(angle4) > Math.PI / 2 && angle4 != 0) {
      // console.log('HERE2', angle4, angle5, angle6);
      // Sometimes we just need to flip 4 and 5
      angle5 = angle5 * -1;
      angle4 = angle4 < 0 ? diff4 : -diff4;
    }
    if (angle4 === Math.PI) {
      // console.log('HERE3', angle4, angle5, angle6);
      angle4 = 0;
      angle5 = angle5 * -1;
    }
    if (Math.abs(angle6) === Math.PI) {
      // console.log('HERE4', angle4, angle5, angle6);
      angle6 = 0;
    }
  }

  return [angle1, angle2, angle3, angle4, angle5, angle6].map((a) => (Object.is(a, -0) ? 0 : a));
};
