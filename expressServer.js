const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const config = require("./configs/mainConfigs");

const rootRouter = require("./routers/rootRouter");

const app = express();

// Hiding morgon loggin outputs in test enviroment to avoid clutter.
if (config.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

app.use(cors()); //  Enable all CORS requests from any origin.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", rootRouter);

app.use((err, req, res, next) => {
  res.status(500).json({ success: false, errMsg: "Server Error Occured." });
});

app.use((req, res) => {
  res.status(404).json({ success: false, errMsg: "Requested Path Not Found." });
});

module.exports = app;
