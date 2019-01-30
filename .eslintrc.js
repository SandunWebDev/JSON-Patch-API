/* This configuration is mostly useful with editor integration & plugins. (ex: VSCode ESLint & Prettier plugins).
 * But if you want to manually lint run "npm run lint".
 * Also when git commiting "using husky + git hooks" code automaticlly get linted and only get commited if no errors occured.
 */

module.exports = {
  extends: ["airbnb-base", "plugin:prettier/recommended"],
  rules: {
    "no-console": "off"
  }
};
