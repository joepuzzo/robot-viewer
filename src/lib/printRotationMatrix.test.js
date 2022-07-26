import { printZRotationMatrix } from './printRotationMatrix';

describe('printZRotationMatrix', () => {
  it('should generate the rotation matrix for z axis rotation around a and print JS matrix out', () => {
    const projection = [
      ['0', '-1', '0'],
      ['1', '0', '0'],
      ['0', '0', '1'],
    ];

    console.log = jest.fn();

    printZRotationMatrix(projection, 'R1_2', 't2');

    // The first argument of the first call to the function was 'hello'
    expect(console.log.mock.calls[0][0]).toBe('const R1_2 = [');
    expect(console.log.mock.calls[1][0]).toBe('  [-Math.sin(t2),-Math.cos(t2),0],');
    expect(console.log.mock.calls[2][0]).toBe('  [Math.cos(t2),-Math.sin(t2),0],');
    expect(console.log.mock.calls[3][0]).toBe('  [0,0,1],');
  });
});
