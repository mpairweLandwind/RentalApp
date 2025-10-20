module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  moduleFileExtensions: ["js", "mjs", "cjs", "json", "node"],
  extensionsToTreatAsEsm: [],
  transform: {},
  testMatch: ["**/tests/**/*.test.mjs", "**/tests/**/*.spec.mjs"],
  testEnvironment: "node",
  setupFilesAfterEnv: [],
  testTimeout: 10000
};