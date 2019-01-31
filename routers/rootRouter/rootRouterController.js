module.exports.rootPath__GET = (req, res) => {
  res.status(200).json({
    success: true,
    msg: "Server is up and running."
  });
};
