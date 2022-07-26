import { matrixDotString } from './matrixDotString.js';
import { printMatrixJS } from './printMatrixJs.js';

describe('matrixDotString', () => {
  it('should generate the matrixDotString for simple matrixDotString', () => {
    const Test_Matrix_1 = [
      ['a', 'b'],
      ['c', 'd'],
    ];

    const Test_Matrix_2 = [
      ['e', 'f'],
      ['g', 'h'],
    ];

    const result = matrixDotString(Test_Matrix_1, Test_Matrix_2);

    const expected = [
      ['a * e + b * g', 'a * f + b * h'],
      ['c * e + d * g', 'c * f + d * h'],
    ];

    expect(result).toEqual(expected);
  });

  it('should generate the matrixDotString for 3x3 matricies', () => {
    const Test_Matrix_1 = [
      ['a', 'b', 'c'],
      ['d', 'e', 'f'],
      ['g', 'h', 'i'],
    ];

    const Test_Matrix_2 = [
      ['j', 'k', 'l'],
      ['m', 'n', 'o'],
      ['p', 'q', 'r'],
    ];

    const result = matrixDotString(Test_Matrix_1, Test_Matrix_2);

    const expected = [
      ['a * j + b * m + c * p', 'a * k + b * n + c * q', 'a * l + b * o + c * r'],
      ['d * j + e * m + f * p', 'd * k + e * n + f * q', 'd * l + e * o + f * r'],
      ['g * j + h * m + i * p', 'g * k + h * n + i * q', 'g * l + h * o + i * r'],
    ];

    expect(result).toEqual(expected);
  });

  it('should generate the matrixDotString for simple matrixDotString with zeros and ones', () => {
    const Test_Matrix_1 = [
      ['1', '0'],
      ['0', '1'],
    ];

    const Test_Matrix_2 = [
      ['0', '1'],
      ['1', '0'],
    ];

    const result = matrixDotString(Test_Matrix_1, Test_Matrix_2);

    const expected = [
      ['0', '1'],
      ['1', '0'],
    ];

    expect(result).toEqual(expected);
  });

  it('should generate the matrixDotString for z axis rotation around a', () => {
    const r0_1_proj = [
      ['1', '0', '0'],
      ['0', '0', '-1'],
      ['0', '1', '0'],
    ];

    const z_matrix_rotation = [
      ['Math.cos(a)', '-Math.sin(a)', '0'], // x0
      ['Math.sin(a)', 'Math.cos(a)', '0'], // y0
      ['0', '0', '1'], // z0
    ];

    const result = matrixDotString(z_matrix_rotation, r0_1_proj);

    const expected = [
      ['Math.cos(a)', '0', 'Math.sin(a)'],
      ['Math.sin(a)', '0', '-Math.cos(a)'],
      ['0', '1', '0'],
    ];

    expect(result).toEqual(expected);
  });

  it('should generate the matrixDotString for z axis rotation around a and print JS matrix out', () => {
    const r1_2_proj = [
      ['0', '-1', '0'],
      ['1', '0', '0'],
      ['0', '0', '1'],
    ];

    const z_matrix_rotation = [
      ['Math.cos(a)', '-Math.sin(a)', '0'], // x0
      ['Math.sin(a)', 'Math.cos(a)', '0'], // y0
      ['0', '0', '1'], // z0
    ];

    const result = matrixDotString(z_matrix_rotation, r1_2_proj);

    const expected = [
      ['-Math.sin(a)', '-Math.cos(a)', '0'],
      ['Math.cos(a)', '-Math.sin(a)', '0'],
      ['0', '0', '1'],
    ];

    expect(result).toEqual(expected);

    console.log = jest.fn();

    printMatrixJS(result, 'R1_2');

    // The first argument of the first call to the function was 'hello'
    expect(console.log.mock.calls[0][0]).toBe('const R1_2 = [');
    expect(console.log.mock.calls[1][0]).toBe('  [-Math.sin(a),-Math.cos(a),0],');
    expect(console.log.mock.calls[2][0]).toBe('  [Math.cos(a),-Math.sin(a),0],');
    expect(console.log.mock.calls[3][0]).toBe('  [0,0,1],');
  });

  it('should generate the matrixDotString for complex matrix strings', () => {
    const Test_Matrix_1 = [
      ['Math.cos(t1)', '0', 'Math.sin(t1)'],
      ['Math.sin(t1)', '0', '-Math.cos(t1)'],
      ['0', '1', '0'],
    ];

    const Test_Matrix_2 = [
      ['-Math.sin(t2)', '-Math.cos(t2)', '0'],
      ['Math.cos(t2)', '-Math.sin(t2)', '0'],
      ['0', '0', '1'],
    ];

    const result = matrixDotString(Test_Matrix_1, Test_Matrix_2);

    const expected = [
      ['Math.cos(t1) * -Math.sin(t2)', 'Math.cos(t1) * -Math.cos(t2)', 'Math.sin(t1)'],
      ['Math.sin(t1) * -Math.sin(t2)', 'Math.sin(t1) * -Math.cos(t2)', '-Math.cos(t1)'],
      ['Math.cos(t2)', '-Math.sin(t2)', '0'],
    ];

    expect(result).toEqual(expected);
  });
});
