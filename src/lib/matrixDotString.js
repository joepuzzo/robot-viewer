/**
 * Use to build variable based matrix!
 *
 * @param {*} a
 * @param {*} b
 * @returns
 */
export const matrixDotString = (a, b) => {
  let result = new Array(a.length).fill(0).map((row) => new Array(b[0].length).fill(0));

  return result.map((row, i) => {
    return row.map((val, j) => {
      const r = a[i].reduce((sum, elm, k) => {
        // If the result will be zero then do nothing
        if (elm === '0' || b[k][j] === '0' || elm === '-0' || b[k][j] === '-0') {
          return sum;
        }

        // If both are 1 then return 1
        if (elm === '1' && b[k][j] === '1') {
          return '1';
        }

        // If one of the operands is one then just return the other operand
        if (elm === '1' || b[k][j] === '1') {
          return elm === '1' ? b[k][j] : elm;
        }

        // If both are -1 then return 1
        if (elm === '-1' && b[k][j] === '-1') {
          return '1';
        }

        // If one of the operands is -1 then just return the other operand negated
        if (elm === '-1' || b[k][j] === '-1') {
          // We replace double neg with posative
          return elm === '-1' ? `-${b[k][j]}`.replace('--', '') : `-${elm}`.replace('--', '');
        }

        // First iteration
        if (sum != '') {
          return `${sum} + ${elm} * ${b[k][j]}`;
        } else {
          return `${elm} * ${b[k][j]}`;
        }
      }, '');

      // If we got nothing then its just a zero!
      if (r === '') {
        return '0';
      }

      // we got something so return that!
      return r;
    });
  });
};
