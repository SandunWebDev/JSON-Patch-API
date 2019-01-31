const loginAuthenticator = require("../../passport/authenticatorsWithCustomErrorHandlers/loginAuthenticator");

// "login" endpoint expect "username and password" provided in response body. Its authentication is handled by passport.
module.exports.auth_loginPath__POST = loginAuthenticator; // PATH ---> "/auth/login"

// Simple utility endpoint where users can check out theres token is valid or not and its expire date, etc... JWT authentication is handled by passport.
module.exports.auth_tokenValidatorPath__POST = (req, res) => {
  const { id, iat, exp } = req.user;

  res.status(200).json({
    success: true,
    msg: "Your Token is valid.",
    username: id,
    // Multiply by 1000 becuase exp, iat values are in milisconds.
    expireAt: new Date(exp * 1000),
    issuedAt: new Date(iat * 1000)
  });
}; // PATH ---> "/auth/tokenValidator"
