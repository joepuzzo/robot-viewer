import { printMatrixJS } from './printMatrixJs';
import { matrixDotString } from './matrixDotString';

export const printZRotationMatrix = (projection, name, angle) => {
  const z_matrix_rotation = [
    [`Math.cos(${angle})`, `-Math.sin(${angle})`, '0'],
    [`Math.sin(${angle})`, `Math.cos(${angle})`, '0'],
    ['0', '0', '1'],
  ];

  const result = matrixDotString(z_matrix_rotation, projection);

  printMatrixJS(result, name);
};
