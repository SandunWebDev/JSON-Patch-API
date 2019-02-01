const httpMocks = require("node-mocks-http");
const { rootPath__GET } = require("./rootRouterController");

describe("Router Controller - '/'", () => {
  describe("Path - 'GET /'", () => {
    it("Should return status code 200 when successfull.", () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      rootPath__GET(req, res);

      expect(res.statusCode).toEqual(200);
    });

    it("Should return JSON body containing `{success: true, ...}` when successfull.", () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      rootPath__GET(req, res);
      const receivedResponse = JSON.parse(res._getData());

      expect(receivedResponse.success).toEqual(true);
    });
  });
});
