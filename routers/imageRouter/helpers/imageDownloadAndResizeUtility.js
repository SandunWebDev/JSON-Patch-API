const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const handleCustomError = require("../../../errorHandlers/handleCustomError");

module.exports.downloadImageAsStream = async function downloadImageAsStream(
  imgageURL
) {
  return axios({
    url: imgageURL,
    method: "GET",
    responseType: "stream"
  }).then(response => response);
};

module.exports.downloadImageToDisk = async function downloadImageToDisk(
  imageURL,
  fileName
) {
  const outputPath = path.resolve(process.cwd(), fileName);
  const writer = fs.createWriteStream(outputPath);

  const response = await axios({
    url: imageURL,
    method: "GET",
    responseType: "stream"
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
};

module.exports.imageResizeGenerator = function imageResizeGenerator(
  width,
  height
) {
  try {
    // Converting and validating width, height
    const widthAsInteger = parseInt(width, 10);
    const heightAsInteger = parseInt(height, 10);

    return sharp().resize(widthAsInteger, heightAsInteger);
  } catch (err) {
    return handleCustomError({
      customErrType: "clientError",
      statusCode: 401,
      customErrMsg: "Not a valid width/height."
    });
  }
};
