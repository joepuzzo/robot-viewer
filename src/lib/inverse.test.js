import { inverse } from './inverse.js';

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
  it('should take inverse of 0, 0, 15', () => {
    expect(inverse(0, 0, 15, robotConfig)).toEqual([0, 0, 0, 0, 0, 0]);
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
  it('should take inverse of 5, 0, 10', () => {
    expect(inverse(5, 0, 10, robotConfig)).toEqual([0, 0, -Math.PI / 2, 0, Math.PI / 2, 0]);
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
  it('should take inverse of -5, 0, 10', () => {
    // prettier-ignore
    expect(inverse(-5, 0, 10, robotConfig)).toEqual([Math.PI, 0, -Math.PI / 2, 0, Math.PI/2, Math.PI]);
  });
});
