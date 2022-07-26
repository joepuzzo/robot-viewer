/**
 * matrixSubset
 *
 * @param {*} m - the matrix
 * @param {*} cols - the number of columns we want
 * @param {*} rows - the number of rows we want
 * @returns a subset of the original matrix
 */
export const matrixSubset = (m, cols, rows) => {
  const subset = [];

  for (let i = 0; i < rows; i++) {
    subset[i] = m[i].slice(0, cols);
  }

  return subset;
};
