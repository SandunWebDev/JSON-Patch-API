const express = require("express");
const { rootPath__GET } = require("./rootRouterController");

const rootRouter = express.Router();

rootRouter.get("/", rootPath__GET);

module.exports = rootRouter;
