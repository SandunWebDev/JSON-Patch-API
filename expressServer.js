const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const passport = require("passport");

require("./passport/passportStrategies");
const config = require("./configs/mainConfigs");

const customErrorHandler = require("./errorHandlers/middlewares/customErrorHandler");
const defaultErrorHandler = require("./errorHandlers/middlewares/defaultErrorHandler");

const rootRouter = require("./routers/rootRouter/rootRouter");
const authRouter = require("./routers/authRouter/authRouter");
const jsonRouter = require("./routers/jsonRouter/jsonRouter");

const app = express();

// Hiding morgon loggin outputs in test enviroment to avoid clutter.
if (config.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

app.use(cors()); //  Enable all CORS requests from any origin.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Public Endpoints
app.use("/", rootRouter);
app.use("/auth", authRouter);

// Protected Endpoints
app.use("/json", jsonRouter);

// Error Handlers
app.use(customErrorHandler);
app.use(defaultErrorHandler);

// Path not found is not a error. So we need custom middleware to catch them.
app.use((req, res) => {
  res.status(404).json({ success: false, errMsg: "Requested Path Not Found." });
});

module.exports = app;
