const passport = require("passport");
const handleCustomError = require("../../errorHandlers/handleCustomError");

module.exports = (req, res, next) => {
  passport.authenticate(
    "local",
    {
      session: false
    },
    // Passport custom error handling.
    (err, user, info) => {
      if (err) {
        // Error Handled by "deafultErrorHandler" middleware.
        return next(err);
      }

      // "user" not populated mean not authenticated.
      if (!user) {
        // Error Handled by "customErrorHandler" middleware.
        return handleCustomError(next, {
          customErrType: "clientError",
          customErrMsg: info.message,
          statusCode: 401
        });
      }

      return res.status(200).json({
        success: true,
        token: user.token,
        username: user.username
      });
    }
  )(req, res, next);
};
