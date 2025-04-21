export const If = ({ condition, otherwise, children }) => {
  return condition ? children : otherwise || null;
};
