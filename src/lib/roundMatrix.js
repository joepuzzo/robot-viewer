import { round as defaultRound } from './round';

export const roundMatrix = (m, round = defaultRound) => {
  const rounded = m.map((row) => row.map((col) => round(col)));
  return rounded;
};

export const cleanMatrix = (m) => {
  const rounded = m.map((row) => row.map((col) => (Object.is(col, -0) ? 0 : col)));
  return rounded;
};

export const cleanAndRoundMatrix = (m, round = defaultRound) => {
  const rounded = m.map((row) =>
    row.map((n) => {
      let rounded = round(n);
      rounded = Object.is(rounded, -0) ? 0 : rounded;
      return rounded;
    })
  );
  return rounded;
};
