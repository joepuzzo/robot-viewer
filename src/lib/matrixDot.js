import { round } from './round';

/**
 * Takes the dot product of two matricies
 *
 * @param {*} a
 * @param {*} b
 * @returns
 */
export function matrixDot(a, b) {
  var result = new Array(a.length).fill(0).map((row) => new Array(b[0].length).fill(0));

  return result.map((row, i) => {
    return row.map((val, j) => {
      return round(a[i].reduce((sum, elm, k) => sum + elm * b[k][j], 0));
    });
  });
}
