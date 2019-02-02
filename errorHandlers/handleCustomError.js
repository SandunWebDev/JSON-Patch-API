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
  // Whether "next()" explicitly passed or not, end result is same. But next() is easier to test.
  if (next) {
    next(modifiedError);
  } else {
    throw modifiedError;
  }
};
