const express = require("express");

const jwtAuthenticator = require("../../passport/authenticatorsWithCustomErrorHandlers/jwtAuthenticator");
const { image_thumbnailPath__POST } = require("./imageRouterController");

const imageRouter = express.Router();

imageRouter.post("/thumbnail", jwtAuthenticator, image_thumbnailPath__POST); // PATH ---> "json/patch"

module.exports = imageRouter;
