module.exports = {
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:prettier/recommended'],
  ignorePatterns: ['*rc.*js', '*.config.*js'],
  parser: undefined,
  parserOptions: { ecmaFeatures: { jsx: true }, sourceType: 'module' },
  plugins: ['import', 'react', 'prettier'],
  root: true,
  rules: { 'import/extensions': [2, 'ignorePackages'] },
};
