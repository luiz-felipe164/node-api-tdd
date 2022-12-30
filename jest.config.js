module.exports = {
  collectCoverage: false,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  roots: [
    '<rootDir>/src'
  ],
  testEnvironment: 'node',
  transform: { '.+\\.ts$': 'ts-jest' }
}
