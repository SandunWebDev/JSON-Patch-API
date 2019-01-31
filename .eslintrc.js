/* This configuration is mostly useful with editor integration & plugins. (ex: VSCode ESLint & Prettier plugins).
 * But if you want to manually lint run "npm run lint".
 * Also when git commiting "using husky + git hooks" code automaticlly get linted and only get commited if no errors occured.
 */

module.exports = {
  extends: ["airbnb-base", "plugin:prettier/recommended"],
  rules: {
    "no-console": "off",
    "no-unused-vars": "off", // Since express error middleware need "next" whether its used or not. TODO: Should find proper solution.
    camelcase: "off"
  },

  // Making "**/*.test.js files" has both es6 and jest env values like "describe, it, ..."
  overrides: [
    {
      files: ["**/*.test.js"],
      env: {
        jest: true
      },
      plugins: ["jest"],
      rules: {
        "jest/no-disabled-tests": "warn",
        "jest/no-focused-tests": "error",
        "jest/no-identical-title": "error",
        "jest/prefer-to-have-length": "warn",
        "jest/valid-expect": "error",
        "no-underscore-dangle": "off", // Because "node-mocks-http" module use underscore methods.
        "global-require": "off"
      }
    }
  ]
};
