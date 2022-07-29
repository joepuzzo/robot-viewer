import { inverse } from './inverse.js';
import { toRadians } from './toRadians.js';

const robotConfig = {
  a1: 2.5, // 2.5
  a2: 3, // 3
  a3: 2.5, // 2.5
  a4: 2.5, // 2.5
  a5: 2.5, // 2.5
  a6: 2, // 2
};

describe('inverse', () => {
  /**
   *     |
   *    [ ]
   *     |
   *    ( )
   *     |
   *    [ ]
   *     |
   *    ( )
   *     |
   *    ( )
   *     |
   *    [ ]
   */
  it('should take inverse of 0, 0, 15, 0, 0, 0', () => {
    expect(inverse(0, 0, 15, 0, 0, 0, robotConfig)).toEqual([0, 0, 0, 0, 0, 0]);
  });

  /**
   *                  [ ]
   *                   |
   *    ( ) -- [ ] -- ( )
   *     |
   *    ( )
   *     |
   *    [ ]
   */
  it('should take inverse of 5, 0, 10, 0, 0, 0', () => {
    expect(inverse(5, 0, 10, 0, 0, 0, robotConfig)).toEqual([
      0,
      0,
      -Math.PI / 2,
      Math.PI,
      -Math.PI / 2,
      0,
    ]);
  });

  /**
   *    [ ]
   *     |
   *    [ ] -- ( ) -- ( )
   *                   |
   *                  ( )
   *                   |
   *                  [ ]
   */
  it('should take inverse of -5, 0, 10, 0, 0, 0', () => {
    // prettier-ignore
    expect(inverse(-5, 0, 10, 0, 0, 0, robotConfig)).toEqual([Math.PI, 0, -Math.PI / 2, Math.PI, -Math.PI/2, -Math.PI]);
  });

  /**
   *
   *
   *    ( ) -- [ ] -- ( ) -- [ ]
   *     |
   *    ( )
   *     |
   *    [ ]
   */
  it('should take inverse of 9.5, 0, 5.5, -d90, -d90, 0', () => {
    const d90 = toRadians(90);

    expect(inverse(9.5, 0, 5.5, -d90, -d90, 0, robotConfig)).toEqual([0, 0, -Math.PI / 2, 0, 0, 0]);
  });
});
