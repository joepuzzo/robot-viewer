import {
  buildHomogeneousDenavitForTable,
  buildHomogeneousDenavitStringForTable,
} from './denavitHartenberg';
import { toRadians } from './toRadians';

const D_90 = toRadians(90);

let t1 = 0; // Theta 1 angle in degrees
let t2 = 90; // Theta 2 angle in degrees
let t3 = 0; // Theta 3 angle in degrees
let t4 = 0; // Theta 4 angle in degrees
let t5 = 0; // Theta 5 angle in degrees
let t6 = 0; // Theta 6 angle in degrees

t1 = toRadians(t1);
t2 = toRadians(t2);
t3 = toRadians(t3);
t4 = toRadians(t4);
t5 = toRadians(t5);
t6 = toRadians(t6);

describe('denavitHartenberg', () => {
  describe('buildHomogeneousDenavitForTable', () => {
    // prettier-ignore
    // Theta | Alpha | r | d
    const PT = [
      [ t1,         D_90,    0,    1 ],
      [ t2 + D_90,  0,       1,    0 ],
      [ t3 - D_90,  -D_90,   0,    0 ],
      [ t4,         D_90,    0,    2 ],
      [ t5,         -D_90,   0,    0 ],
      [ t6,         0,       0,    2 ]
    ];

    it('should build Homogeneous transformation matrix from given P Table', () => {
      const { matriceis, endMatrix } = buildHomogeneousDenavitForTable(PT);

      // prettier-ignore
      const expectedEnd = [
        [0, 0,  -1, -5],
        [0, 1,  0,  0],
        [1, 0,  0,  1],
        [0, 0,  0,  1],
      ];

      expect(endMatrix).toEqual(expectedEnd);
    });
  });

  describe('buildHomogeneousDenavitStringForTable', () => {
    it('should build rotation transformation matrix from given P Table', () => {
      // Note: this is the H3_6 P table for my kinematics
      const PT = [
        ['t4', 'd90', '0', 'v2 + v3'],
        ['t5', '-d90', '0', '0'],
        ['t6', '0', '0', 'v4 + v5'],
      ];

      const { endRotation } = buildHomogeneousDenavitStringForTable(PT);

      const expectedEndRotation = [
        [
          'Math.cos(t4) * Math.cos(t5) * Math.cos(t6) + -Math.sin(t4) * Math.sin(t6)',
          'Math.cos(t4) * Math.cos(t5) * -Math.sin(t6) + -Math.sin(t4) * Math.cos(t6)',
          'Math.cos(t4) * -Math.sin(t5)',
        ],
        [
          'Math.sin(t4) * Math.cos(t5) * Math.cos(t6) + Math.cos(t4) * Math.sin(t6)',
          'Math.sin(t4) * Math.cos(t5) * -Math.sin(t6) + Math.cos(t4) * Math.cos(t6)',
          'Math.sin(t4) * -Math.sin(t5)',
        ],
        ['Math.sin(t5) * Math.cos(t6)', 'Math.sin(t5) * -Math.sin(t6)', 'Math.cos(t5)'],
      ];

      expect(endRotation).toEqual(expectedEndRotation);
    });

    it('should build rotation transformation matrix from given P Table', () => {
      // prettier-ignore
      // Note: this is the H3_6 P table for the UR robot
      const PT = [
        ['t4', 'd90',   '0', 'v3'],
        ['t5', '-d90',  '0', 'v4'],
        ['t6', '0',     '0', 'v5'],
      ];

      const { endRotation } = buildHomogeneousDenavitStringForTable(PT);

      console.log(endRotation);

      const expectedEndRotation = [
        [
          'Math.cos(t4) * Math.cos(t5) * Math.cos(t6) + -Math.sin(t4) * Math.sin(t6)',
          'Math.cos(t4) * Math.cos(t5) * -Math.sin(t6) + -Math.sin(t4) * Math.cos(t6)',
          'Math.cos(t4) * -Math.sin(t5)',
        ],
        [
          'Math.sin(t4) * Math.cos(t5) * Math.cos(t6) + Math.cos(t4) * Math.sin(t6)',
          'Math.sin(t4) * Math.cos(t5) * -Math.sin(t6) + Math.cos(t4) * Math.cos(t6)',
          'Math.sin(t4) * -Math.sin(t5)',
        ],
        ['Math.sin(t5) * Math.cos(t6)', 'Math.sin(t5) * -Math.sin(t6)', 'Math.cos(t5)'],
      ];

      expect(endRotation).toEqual(expectedEndRotation);
    });
  });
});
