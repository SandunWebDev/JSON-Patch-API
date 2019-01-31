const app = require("./expressServer");
const config = require("./configs/mainConfigs");

app
  .listen(config.PORT, () =>
    console.log(
      `Server is running on "${config.NODE_ENV}" enviroment at port ${
        config.PORT
      }.`
    )
  )
  .on("error", err => {
    console.log(
      `Error : Specified PORT ${config.PORT} is already in use. (${
        err.message
      })`
    );
    process.exit();
  });
