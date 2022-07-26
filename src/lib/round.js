export const round = (n) => Math.round(n * 1000000) / 1000000;

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
