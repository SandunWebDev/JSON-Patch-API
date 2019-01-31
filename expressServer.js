const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const config = require("./configs/mainConfigs");

const app = express();

// Hiding morgon loggin outputs in test enviroment to avoid clutter.
if (config.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

//  Enable all CORS requests from any origin.
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", (req, res) => {
  res.json({
    success: true,
    msg: "Server is up and running."
  });
});

app.use((err, req, res, next) => {
  res.status(500).json({ success: false, errMsg: "Server Error Occured." });
});

app.use((req, res) => {
  res.status(404).json({ success: false, errMsg: "Requested Path Not Found." });
});

module.exports = app;
