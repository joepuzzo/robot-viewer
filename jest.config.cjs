const config = {
  collectCoverage: false,
  verbose: true,
  testEnvironment: 'node',
  testEnvironmentOptions: {
    url: 'http://localhost/'
  },
  moduleNameMapper: {
    '\\.(css)$': '<rootDir>/mocks/style-mock.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/mocks/file-mock.js',
  },
  setupFilesAfterEnv: ['./jest.setup.js'],
  transform: {
    '^.+\\.js$': 'babel-jest'
  }
};

module.exports = config;
