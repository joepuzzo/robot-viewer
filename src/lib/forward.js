import { buildHomogeneousDenavitForTable } from './denavitHartenberg';
import { toRadians } from './toRadians';

export const forward = (t1, t2, t3, t4, t5, t6, robotConfig) => {
  const { a1, a2, a3, a4, a5, a6, x0 = 0 } = robotConfig;

  // 90 in radians
  const d90 = toRadians(90);

  // prettier-ignore
  const PT = [
    [ t1, d90, x0, a1 ],
    [ t2+d90, 0, a2, 0 ],
    [ t3-d90, -d90, 0, 0 ],
    [ t4, d90, 0, a3 + a4 ],
    [ t5, -d90, 0, 0 ],
    [ t6, 0, 0, a5+ a6 ]
  ];

  const res = buildHomogeneousDenavitForTable(PT);

  // console.table(res.endMatrix);
  return res.endMatrix;
};
