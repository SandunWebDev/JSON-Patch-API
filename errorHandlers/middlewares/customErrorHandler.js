// Custome Error Middleware to catch error directed by "handleCustomError(next, config)".

const config = require("../../configs/mainConfigs");

module.exports = (err, req, res, next) => {
  // Loggin error if its specified (log:true) and in development enviroment.
  if (err.log === true && config.NODE_ENV === "development") {
    console.log("Error Occured : \n", err);
  }

  // Only catch error that have custom property called "customErrType". All other errors get directed to next error middleware.
  if (err.customErrType) {
    return res.status(err.statusCode || 500).json({
      success: false,
      errMsg: err.customErrMsg || "Server Error Occured."
    });
  }

  return next(err);
};
