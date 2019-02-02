const passport = require("passport");
const handleCustomError = require("../../errorHandlers/handleCustomError");

module.exports = (req, res, next) => {
  passport.authenticate(
    "jwt",
    {
      session: false
    },
    (err, user, info) => {
      if (err) {
        // Error Handled by "deafultErrorHandler" middleware.
        return next(err);
      }

      // "user" not populated mean not authenticated.
      if (!user) {
        // Error Handled by "customErrorHandler" middleware.
        return handleCustomError({
          customErrType: "clientError",
          customErrMsg: "Invalid/Missing Token.",
          statusCode: 401
        });
      }

      // When custom error handlers used, its our responsibility to pass this if needed.
      req.user = user;

      return next();
    }
  )(req, res, next);
};
