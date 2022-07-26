import { inverse1_3 } from './inverse1_3.js';
import { roundArray } from './round.js';
import { toRadians } from './toRadians.js';

const robotConfig = {
  a1: 1,
  a2: 1,
  a3: 1,
};

describe('inverse', () => {
  /**
   *     |
   *    ( )
   *     |
   *    ( )
   *     |
   *    [ ]
   */
  it('should take inverse of 0, 0, 3', () => {
    expect(inverse1_3(0, 0, 3, robotConfig)).toEqual([0, 0, 0]);
  });

  /**
   *
   *    ( ) --
   *     |
   *    ( )
   *     |
   *    [ ]
   */
  it('should take inverse of 1, 0, 2', () => {
    const inverse = inverse1_3(1, 0, 2, robotConfig);
    const expected = [0, 0, toRadians(-90)];

    const roundedInverse = roundArray(inverse);
    const roundedExpected = roundArray(expected);

    expect(roundedInverse).toEqual(roundedExpected);
  });

  /**
   *
   *    ( ) -- ( ) --
   *     |
   *    [ ]
   */
  it('should take inverse of 2, 0, 1', () => {
    const inverse = inverse1_3(2, 0, 1, robotConfig);
    const expected = [0, toRadians(-90), 0];

    const roundedInverse = roundArray(inverse);
    const roundedExpected = roundArray(expected);

    expect(roundedInverse).toEqual(roundedExpected);
  });

  /**
   *
   *       ( ) -- ( )
   *        |      |
   *              [ ]
   *
   * Note: two solutions for this
   *
   *     const expected = [Math.PI, toRadians(-90), toRadians(-90)];
   *     const expected = [0, toRadians(90), toRadians(90)];
   *
   * The first one is what our inverse comes up with
   */
  it('should take inverse of -1, 0, 0', () => {
    const inverse = inverse1_3(-1, 0, 0, robotConfig);
    const expected = [Math.PI, toRadians(-90), toRadians(-90)];

    const roundedInverse = roundArray(inverse);
    const roundedExpected = roundArray(expected);

    expect(roundedInverse).toEqual(roundedExpected);
  });

  /**
   *        |
   *       ( ) -- ( )
   *               |
   *              [ ]
   *
   *
   *          --  ( )
   *               |
   *              ( )
   *               |
   *              [ ]
   *
   *
   * Note: four solutions for this
   *
   *     const expected = [Math.PI, toRadians(-90), toRadians(90)];
   *     const expected = [0, toRadians(90), toRadians(-90)];
   *     const expected = [0, 0, toRadians(90)];
   *     const expected = [Math.PI, 0, toRadians(-90)];
   *
   * The first one is what our inverse comes up with
   */
  it('should take inverse of -1, 0, 2', () => {
    const inverse = inverse1_3(-1, 0, 2, robotConfig);
    const expected = [Math.PI, 0, toRadians(-90)];

    const roundedInverse = roundArray(inverse);
    const roundedExpected = roundArray(expected);

    expect(roundedInverse).toEqual(roundedExpected);
  });
});
