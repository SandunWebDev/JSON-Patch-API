const httpMocks = require("node-mocks-http");
const defaultErrorHandler = require("./defaultErrorHandler");
const config = require("../../configs/mainConfigs");

describe("Error Handler - defaultErrorHandler", () => {
  const err = new Error("My Error");
  const req = httpMocks.createRequest();
  const res = httpMocks.createResponse();
  const next = jest.fn();

  it("Should return status code 500 and JSON body {success: false, errMsg:...} when this errorhandler triggered.", () => {
    defaultErrorHandler(err, req, res, next);
    const receivedResponse = JSON.parse(res._getData());

    expect(res.statusCode).toEqual(500);
    expect(receivedResponse.success).toEqual(false);
    expect(receivedResponse).toHaveProperty("errMsg");
  });
});
