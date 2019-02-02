// Custom Fucntion to Generate custom errors and redirect them to "customErrorHandler" middleware.

module.exports = (errConfigs = {}) => {
  // Configs and default values
  const {
    next,
    err = new Error(),
    customErrType = "clientError",
    statusCode = 500,
    customErrMsg = "Server Error Occured.",
    log = false
  } = errConfigs;

  const modifiedError = Object.assign({}, err, {
    customErrType,
    statusCode,
    customErrMsg,
    log
  });

  // Sending custome error to get catched by  "customErrorHandler" middleware.
  if (next) {
    // Using "next()" when explicitly specified. Useful for testing purposes.
    next(modifiedError);
  } else {
    // Using "throw" instead of "next(modifiedError)" beacuse then theres no need to explicitly pass "next" object and we can use this utitlity any where.
    throw modifiedError;
  }
};
