export const round = (n, to = 1000000) => Math.round(n * to) / to;

export const roundOne = (n) => {
  let r = n;
  if (r > 1) {
    return 1;
  }

  if (r < -1) {
    return -1;
  } else return r;
};

/**
 * Rounds the array and removes negative zeros
 *
 * @param {*} arr
 * @returns
 */
export const roundArray = (arr) => {
  return arr.map((n) => {
    let rounded = round(n);
    rounded = Object.is(rounded, -0) ? 0 : rounded;
    return rounded;
  });
};
