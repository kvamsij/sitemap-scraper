/** @type {import('ts-jest').JestConfigWithTsJest} **/
/* global module */

module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {}],
  },
  testMatch: ["**/src/tests/**/*.test.ts"], // Ensure tests are run from the src folder
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], // Add the setup file
};