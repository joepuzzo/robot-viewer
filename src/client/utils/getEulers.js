export const getZXZ = (orientation) => {
  switch (orientation) {
    case 'x':
      return [90, 90, 90];
    case '-x':
      return [-270, -90, -90];
    case 'y':
      return [0, -90, 0];
    case '-y':
      return [-180, -90, 0];
    case 'z':
      return [0, 0, 0];
    case '-z':
      return [-90, -180, 0];
    // return [90, 180, 0];
    default:
      break;
  }
};
