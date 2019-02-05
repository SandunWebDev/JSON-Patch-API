// This endpoint ("/image/") handle image related task like Thubmnail Generating(/image/thumbnail), etc...
const validator = require("validator");

const {
  imageResizeGenerator,
  downloadImageAsStream
} = require("./helpers/imageDownloadAndResizeUtility");
const handleCustomError = require("../../errorHandlers/handleCustomError");

// PATH ---> "image/thumbnail"
module.exports.image_thumbnailPath__POST = (req, res, next) => {
  const { imageURL, width = 50, height = 50 } = req.body;

  // Validating required parameters.
  if (!imageURL) {
    return handleCustomError({
      customErrType: "clientError",
      statusCode: 401,
      customErrMsg: "Missing Necessary Parameters. (imageURL)"
    });
  }

  if (!validator.isURL(imageURL)) {
    return handleCustomError({
      customErrType: "clientError",
      statusCode: 401,
      customErrMsg: "Provided imageUrl is invalid."
    });
  }

  // Image Resizer Pipe
  const imageResizer = imageResizeGenerator(width, height);

  /* For speedy response we are resizing direcly from stream instead of downloading image and then resizing it. 
      If want to achive that path then use "downloadImageToDisk()" and pipe local file to imageResizer.
    */

  // Downloading image and piping image stream through different pipeline steps to serve resized image to user.
  downloadImageAsStream(imageURL)
    .then(response => {
      const imageStream = response.data;
      const downloadedImageContentType = response.data.headers["content-type"];

      res.type(downloadedImageContentType);

      imageStream.pipe(imageResizer).pipe(res);
    })
    .catch(err => {
      return handleCustomError({
        next,
        customErrType: "clientError",
        statusCode: 401,
        customErrMsg: `Error Occured While Fetching Your Image. Check your Image URL is Public & Online. Then Try Agin.`
      });
    });
};
