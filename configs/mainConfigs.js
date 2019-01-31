const dotenv = require("dotenv");

const terminalEnvValues = process.env; // Parsing enviroment variables from "terminal enviroment"
const { parsed: parsedEnvValues = {} } = dotenv.config(); // Loading & Parsing enviroment variables from ".env" file. Pass explicit values if want to override these.

// Default values for any enviroment. (Only applicable if specifcally not provided in terminal enviroment or .env file)
const defaultEnvValues = {
  NODE_ENV: "development",
  PORT: "4000"
};

// Provide any override default value for specific enviroment here.
const defaultEnvValuesOverrides_development = {};
const defaultEnvValuesOverrides_test = {};
const defaultEnvValuesOverrides_production = {
  PORT: "80"
};

// All Configs (For Development, Testing, Production)
// Specifity of env. values from Higher to Lower is "Terminal ENV. Values --> .env File Values --> Default Override Values -> Default Values"
// TODO : Create seperate function to generate appopriate configs instead of getting in plain object.
const configs = {
  development: Object.assign(
    {},
    defaultEnvValues,
    defaultEnvValuesOverrides_development,
    parsedEnvValues,
    terminalEnvValues
  ),

  test: Object.assign(
    {},
    defaultEnvValues,
    defaultEnvValuesOverrides_test,
    parsedEnvValues,
    terminalEnvValues
  ),

  production: Object.assign(
    {},
    defaultEnvValues,
    defaultEnvValuesOverrides_production,
    parsedEnvValues,
    terminalEnvValues
  )
};

// if "NODE_ENV" not explicitly passed use "development" preset as default.
const NODE_ENV =
  process.env.NODE_ENV || parsedEnvValues.NODE_ENV || "development";

// Dirty hack to hide console.xxx in test enviroment so they don't distract test results.
if (NODE_ENV === "test") {
  console.info = () => {};
}

// Exporting config values according to specified NODE_ENV.
module.exports = configs[NODE_ENV];
