const config = {
  collectCoverage: false,
  verbose: true,
  testURL: 'http://localhost/',

  // If you're seeing Jest choke on an import/export, or any other ES6 in a dependency
  // you'll need these two lines, as well as the babelConfig.
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  // collectCoverageFrom: ['<rootDir>/src/client/**/*', '<rootDir>/src/server/**/*'],
  moduleNameMapper: {
    '\\.(css)$': '<rootDir>/mocks/style-mock.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/mocks/file-mock.js',
  },
  setupFilesAfterEnv: ['./jest.setup.js'],
};

export default config;
