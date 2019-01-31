const express = require("express");

const jwtAuthenticator = require("../../passport/authenticatorsWithCustomErrorHandlers/jwtAuthenticator");
const { auth_loginPath__POST } = require("./authRouterController");
const { auth_tokenValidatorPath__POST } = require("./authRouterController");

const authRouter = express.Router();

authRouter.post("/login", auth_loginPath__POST); // PATH ---> "/auth/login"

authRouter.post(
  "/tokenValidator",
  jwtAuthenticator,
  auth_tokenValidatorPath__POST
); // PATH ---> "/auth/tokenValidator"

module.exports = authRouter;
