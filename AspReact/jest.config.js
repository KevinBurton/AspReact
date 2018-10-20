const {defaults} = require('jest-config');
module.exports = {
  transform: {
      "^.+\\.tsx?$": "ts-jest",
      "^.+\\.ts?$": "ts-jest"
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?|ts?|js?)$",
  moduleFileExtensions: [...defaults.moduleFileExtensions,"ts", "tsx"],
  transformIgnorePatterns: ["<rootDir>/node_modules"]
};
