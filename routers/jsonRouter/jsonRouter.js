const express = require("express");

const jwtAuthenticator = require("../../passport/authenticatorsWithCustomErrorHandlers/jwtAuthenticator");
const { json_patchPath__POST } = require("./jsonRouterController");

const jsonRouter = express.Router();

jsonRouter.post("/patch", jwtAuthenticator, json_patchPath__POST); // PATH ---> "json/patch"

module.exports = jsonRouter;
