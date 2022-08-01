import { xyz, zxz } from './euler';
import { cleanAndRoundMatrix, roundMatrix } from './roundMatrix';
import { toRadians } from './toRadians';

describe('euler', () => {
  describe('ZXZ', () => {
    /**
     *      Z0-Z1
     *       ^
     *       |
     *       |
     *       |
     *       |
     *       + -----------> Y0-Y1
     *      /
     *     /
     *    /
     * X0-X1
     *
     */
    it('should rotate nothing', () => {
      const actual = zxz(0, 0, 0);

      const expected = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ];

      expect(actual).toEqual(expected);
    });

    /**
     *      Z0-Z1
     *       ^
     *       |
     *       |
     *       |
     *       |
     *       + -----------> Y0-Y1
     *      /
     *     /
     *    /
     * X0-X1
     *
     */
    it('should rotate correctly for 90 -90 0', () => {
      const actual = zxz(toRadians(90), toRadians(-90), 0);

      const expected = [
        [0, 0, -1],
        [1, 0, 0],
        [0, -1, 0],
      ];

      const roundedExpected = cleanAndRoundMatrix(expected);
      const roundedActual = cleanAndRoundMatrix(actual);

      // console.table(roundedExpected);
      // console.table(roundedActual);

      expect(roundedActual).toEqual(roundedExpected);
    });
  });

  describe.skip('XYZ', () => {
    /**
     *       X
     *       ^
     *       |
     *       |
     *       |
     *       |
     *       + -----------> Y
     *      /
     *     /
     *    /
     *   Z
     *
     */
    it('should rotate nothing', () => {
      const actual = xyz(0, 0, 0);

      const expected = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ];

      expect(actual).toEqual(expected);
    });

    /**
     *       X
     *       ^
     *       |
     *       |
     *       |
     *       |
     *       + -----------> Y
     *      /
     *     /
     *    /
     *   Z
     *
     */
    it('should rotate correctly for 90 90 0', () => {
      const actual = xyz(toRadians(90), toRadians(90), 0);

      const expected = [
        [0, 0, -1],
        [1, 0, 0],
        [0, -1, 0],
      ];

      const roundedExpected = cleanAndRoundMatrix(expected);
      const roundedActual = cleanAndRoundMatrix(actual);

      console.table(roundedExpected);
      console.table(roundedActual);

      expect(roundedActual).toEqual(roundedExpected);
    });
  });
});
