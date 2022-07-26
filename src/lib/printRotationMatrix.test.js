import { printZRotationMatrix } from './printRotationMatrix';
import { rotateAroundZAxis } from './rotateMatrix';
import { roundMatrix } from './roundMatrix';
import { toRadians } from './toRadians';
import { matrixEqual } from './matrixEqual';

describe('printZRotationMatrix', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should generate the rotation matrix for z axis rotation around a and print JS matrix out', () => {
    const projection = [
      ['0', '-1', '0'],
      ['1', '0', '0'],
      ['0', '0', '1'],
    ];

    jest.spyOn(console, 'log').mockImplementation(() => {});

    printZRotationMatrix(projection, 'R1_2', 't2');

    // The first argument of the first call to the function was 'hello'
    expect(console.log.mock.calls[0][0]).toBe('const R1_2 = [');
    expect(console.log.mock.calls[1][0]).toBe('  [-Math.sin(t2),-Math.cos(t2),0],');
    expect(console.log.mock.calls[2][0]).toBe('  [Math.cos(t2),-Math.sin(t2),0],');
    expect(console.log.mock.calls[3][0]).toBe('  [0,0,1],');
    expect(console.log.mock.calls[4][0]).toBe(']');
  });

  it('result of executing the printed matrix should match actual matrix multiplication', () => {
    const r1_2_proj = [
      [0, -1, 0],
      [1, 0, 0],
      [0, 0, 1],
    ];

    const t2 = toRadians(90);

    // From above test
    const expected = [
      [-Math.sin(t2), -Math.cos(t2), 0],
      [Math.cos(t2), -Math.sin(t2), 0],
      [0, 0, 1],
    ];

    const actual = rotateAroundZAxis(r1_2_proj, t2);

    const roundedExpected = roundMatrix(expected);
    const roundedActual = roundMatrix(actual);

    expect(roundedActual).toEqual(roundedExpected);

    expect(matrixEqual(roundedActual, roundedExpected)).toEqual(true);
  });
});
