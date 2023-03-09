import { Debug } from './debug';
import { toRadians } from './toRadians';
const logger = Debug('ik:inverse1_3' + '\t');

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
 * OR
 * c ** 2 = a ** 2 + b ** 2 - 2 * a * b * Math.cos( alpha )
 *
 * where alpha is angle opposite side c
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
 * Below depicts J1 -- J2
 *                            ●
 *                          ● ● |
 *                        ●  ●  |
 *                      ●   ●   |
 *                    ●    ●    |
 *                  ●     ● a3  |
 *           r3   ●      ●      |
 *              ●       ●       |
 *            ●        ●  \->t3 | r2
 *          ●     p3 (●)        |
 *        ●       ●             |
 *      ●   \  ●  a2            |
 *    ●\ p1 ●\                  |
 *  ●   \●    \ -> p2           |
 *   (●) \->t2 \                |
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
 *  -------- TopDownView if offsetX --------
 *            .           y0_3
 *           /             |
 *          /              |
 *    r1  [ ]              |
 *        /                |
 *       /                 |
 *      /                  |
 *    [ ]                  |
 *    /                    |
 *   /
 *  / t1
 * ( )
 * _ _ _ _ _ _ _ _ _ _ _ _ _ x0_3
 *
 *  -------- TopDownView if offsetY --------
 *                  .           y0_3
 *                 /             |
 *                /              |
 *          r1  [ ]              |
 *              /                |
 *             /                 |
 *            / t1               |
 *     ( )   /                   |
 *          /
 *      _ _ _ _ _ _ _ _ _ _ _ x0_3
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

/**
 * https://www.youtube.com/watch?v=D93iQVoSScQ
 *
 * @param {*} x
 * @param {*} y
 * @param {*} z
 * @param {*} robotConfig
 * @returns
 */
export const inverse1_3 = (x, y, z, robotConfig) => {
  const { a1, a2, a3, x0 = 0, y0 = 0, adjustments } = robotConfig;

  const r1 = computeR1(x, y) - x0;
  logger('r1', r1);
  const r2 = computeR2(z, a1);
  logger('r2', r2);
  const p2 = computeP2(r1, r2);
  logger('p2', p2);
  const r3 = computeR3(r1, r2);
  logger('r3', r3);
  const p1 = computeP1(a2, a3, r3);
  logger('p1', p1);
  const p3 = computeP3(a2, a3, r3);
  logger('p3', p3);

  let t1 = computeT1(x, y - y0);
  let t2 = -computeT2(p1, p2); // Needed to negate to match main x, y frame
  let t3 = -computeT3(p3); // Needed to negate to match main x, y frame

  // Optional adjustments for angles
  if (adjustments) {
    const t1Adjustment = toRadians(adjustments.t1);
    t2 = t2 < 0 ? t2 - t1Adjustment : t2 + t1Adjustment;
  }

  // Return angles removing negative zeros
  return [t1, t2, t3].map((a) => (Object.is(a, -0) ? 0 : a));
};
