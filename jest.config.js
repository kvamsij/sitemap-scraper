/** @type {import('ts-jest').JestConfigWithTsJest} **/
/* global module*/

module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
};