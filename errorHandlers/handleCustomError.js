// Custom Fucntion to Generate custom errors and redirect them to "customErrorHandler" middleware.

module.exports = (next, config = {}) => {
  // Configs and default values
  const {
    err = new Error(),
    customErrType = "clientError",
    statusCode = 500,
    customErrMsg = "Server Error Occured.",
    log = false
  } = config;

  const modifiedError = Object.assign({}, err, {
    customErrType,
    statusCode,
    customErrMsg,
    log
  });

  // This is get catched by  "customErrorHandler" middleware.
  next(modifiedError);
};
