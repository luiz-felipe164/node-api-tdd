module.exports = {
  collectCoverage: false,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  preset: '@shelf/jest-mongodb',
  roots: [
    '<rootDir>/src'
  ],
  testEnvironment: 'node',
  transform: { '.+\\.ts$': 'ts-jest' }
}
