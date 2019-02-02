// This endpoint ("/json/") handle json related task like JSONPatching(/json/patch), etc...
const jsonpatch = require("fast-json-patch");
const { jsonRouter__ErrorHandler } = require("./helpers/errorHandlers");

module.exports.json_patchPath__POST = (req, res) => {
  // PATH ---> "json/patch"
  const { document, patch } = req.body;

  try {
    if (!document || !patch) {
      throw new Error("Missing Necessary Parameters. (document/patch)");
    }

    // Converting recived text parameters to Javascript Object.
    const jsonDocument = JSON.parse(document);
    const jsonPatcher = JSON.parse(patch);

    // JSON Patching.
    const patchedDocument = jsonpatch.applyPatch(
      jsonDocument,
      jsonPatcher,
      true
    ).newDocument;

    res.status(200).json({
      success: true,
      patchedDocument
    });
  } catch (err) {
    jsonRouter__ErrorHandler(err);
  }
};
