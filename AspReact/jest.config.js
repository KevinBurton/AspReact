const {defaults} = require('jest-config');
module.exports = {
  transform: {
      "^.+\\.tsx?$": "ts-jest"
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?|ts?|js?)$",
  moduleFileExtensions: [...defaults.moduleFileExtensions,"ts", "tsx"],
  transformIgnorePatterns: ["<rootDir>/node_modules"],
  // Setup Enzyme
  snapshotSerializers: ["enzyme-to-json/serializer"],
  setupTestFrameworkScriptFile: "<rootDir>/setupEnzyme.ts"
};
