// Default Error Middleware to catch error directed by "next(err)" and any other errors that didn't get catched by other error middleware.
const config = require("../../configs/mainConfigs");

module.exports = (err, req, res, next) => {
  // Loggin error in development enviroment
  if (config.NODE_ENV === "development") {
    console.log("Error Occured : \n", err);
  }

  res.status(500).json({ success: false, errMsg: "Server Error Occured." });
};
