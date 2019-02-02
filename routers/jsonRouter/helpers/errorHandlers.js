const handleCustomError = require("../../../errorHandlers/handleCustomError");

module.exports.jsonRouter__ErrorHandler = function jsonRouter__ErrorHandler(
  err
) {
  switch (true) {
    // Missing Parameters Errors
    case err.message.includes("Missing Necessary Parameters"): {
      return handleCustomError({
        customErrType: "clientError",
        statusCode: "401",
        customErrMsg: err.message
      });
    }
    // JSON Parse Errors
    case err.message.includes("JSON at position"): {
      return handleCustomError({
        customErrType: "clientError",
        statusCode: "401",
        customErrMsg: "Provided document/patch parameters are not valid JSON."
      });
    }
    // JSON Patch Errors & Others.
    default: {
      return handleCustomError({
        customErrType: "clientError",
        statusCode: "401",
        customErrMsg: err.message
      });
    }
  }
};
