/**
 * Prints out the JS function for this matrix
 * @param {*} m - the matrix
 * @param {*} c - the variable name
 */
export const printMatrixJS = (m, c) => {
  console.log(`const ${c} = [`);
  m.forEach((a) => console.log(`  [${a}],`));
  console.log(']');
};
