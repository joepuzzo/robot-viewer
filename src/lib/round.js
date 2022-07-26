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
