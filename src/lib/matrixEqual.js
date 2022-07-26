export const matrixEqual = (m1, m2) => {
  // If sizes are not same return early
  if (m1.length != m2.length || m1[0].length != m2[0].length) {
    return false;
  }

  // return the second something is not equal
  for (let i = 0; i < m1.length; i++) {
    for (let j = 0; j < m1.length; j++) {
      if (m1[i][j] != m2[i][j]) {
        return false;
      }
    }
  }

  // If we got here we are equal! so return true!!
  return true;
};
