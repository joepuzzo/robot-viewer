import { forward } from './forward.js';
import { toRadians } from './toRadians.js';

const robotConfig = {
  a1: 2.5, // 2.5
  a2: 3, // 3
  a3: 2.5, // 2.5
  a4: 2.5, // 2.5
  a5: 2.5, // 2.5
  a6: 2, // 2
};

describe('forward', () => {
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
  it('should take forward of 0, 0, 0, 0, 0, 0', () => {
    expect(forward(0, 0, 0, 0, 0, 0, robotConfig)).toEqual([
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 15],
      [0, 0, 0, 1],
    ]);
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
  it('should take forward of 0, 0, -90, 180, -90, 0', () => {
    expect(forward(0, 0, -Math.PI / 2, Math.PI, -Math.PI / 2, 0, robotConfig)).toEqual([
      [-1, 0, 0, 5],
      [0, -1, 0, 0],
      [0, 0, 1, 10],
      [0, 0, 0, 1],
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
  it('should take forward of 180, 0, -90, 180, -90, 180', () => {
    // prettier-ignore

    expect(forward(Math.PI, 0, -Math.PI / 2, Math.PI, -Math.PI/2, -Math.PI, robotConfig)).toEqual([
      [-1, 0, 0, -5],
      [0, -1, 0, 0],
      [0, 0, 1, 10],
      [0, 0, 0, 1],
    ]);
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
  it('should take forward of 0, 0, -90, 0, 0, 0', () => {
    // expect(inverse(9.5, 0, 5.5, -d90, -d90, 0, robotConfig)).toEqual([0, 0, -Math.PI / 2, 0, 0, 0]);

    expect(forward(0, 0, -Math.PI / 2, 0, 0, 0, robotConfig)).toEqual([
      [0, 0, 1, 9.5],
      [0, 1, 0, 0],
      [-1, 0, 0, 5.5],
      [0, 0, 0, 1],
    ]);
  });
});
