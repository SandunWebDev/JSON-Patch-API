const httpMocks = require("node-mocks-http");
const { json_patchPath__POST } = require("./jsonRouterController");
const { jsonRouter__ErrorHandler } = require("./helpers/errorHandlers");

describe("Router Controller - '/json'", () => {
  describe("Path - '/json/patch'", () => {
    describe("When path is already JWT validated (token) and the neccessary parameters (document, patch) are provided and valid.", () => {
      let req;
      let res;

      beforeEach(() => {
        // Dummy Data
        const document = JSON.stringify({
          firstName: "John",
          lastName: "Doe"
        });

        const patch = JSON.stringify([
          { op: "replace", path: "/firstName", value: "Dwayne" }
        ]);

        // Mocking successfull request.
        req = httpMocks.createRequest({
          method: "POST",
          body: {
            token: "validToken",
            document,
            patch
          }
        });

        res = httpMocks.createResponse();
      });

      afterEach(() => {
        // Resetting mocking objects.
        req = "";
        res = "";
      });

      it("Should return status code 200.", () => {
        json_patchPath__POST(req, res);

        expect(res.statusCode).toEqual(200);
      });

      it("Should return JSON containing {success : true, patchedDocument: ...}.", () => {
        json_patchPath__POST(req, res);
        const responseData = JSON.parse(res._getData());

        expect(responseData.success).toEqual(true);
        expect(responseData.patchedDocument).toEqual({
          firstName: "Dwayne",
          lastName: "Doe"
        });
      });
    });

    describe("When path is already JWT validated but some of neccessary parameters are NOT provided or valid.", () => {
      let req;
      let res;
      let next__MOCK;

      // Dummy Data Parameters
      const document = JSON.stringify({
        firstName: "John",
        lastName: "Doe"
      });

      const patch = JSON.stringify([
        { op: "replace", path: "/firstName", value: "Dwayne" }
      ]);

      beforeEach(() => {
        res = httpMocks.createResponse();

        next__MOCK = jest.fn().mockImplementation(errResult => errResult);
      });

      afterEach(() => {
        // Resetting mocking objects.
        req = "";
        res = "";
        next__MOCK.mockReset();
      });

      it("Error Should be handled when 'document' parameter is NOT provided.", () => {
        // Mocking "document" is not provided.
        req = httpMocks.createRequest({
          method: "POST",
          body: {
            token: "validToken",
            // document,
            patch
          }
        });

        json_patchPath__POST(req, res, next__MOCK);

        expect(next__MOCK).toBeCalledTimes(1);
        expect(next__MOCK.mock.results[0].value.customErrType).toEqual(
          "clientError"
        );
        expect(next__MOCK.mock.results[0].value.statusCode).toEqual(401);
      });

      it("Error Should be handled when 'patch' parameter is NOT provided.", () => {
        // Mocking "patch" is not provided.
        req = httpMocks.createRequest({
          method: "POST",
          body: {
            token: "validToken",
            document
            // patch
          }
        });

        json_patchPath__POST(req, res, next__MOCK);

        expect(next__MOCK).toBeCalledTimes(1);
        expect(next__MOCK.mock.results[0].value.customErrType).toEqual(
          "clientError"
        );
        expect(next__MOCK.mock.results[0].value.statusCode).toEqual(401);
      });

      it("Error Should be handled when both 'document and patch' parameter is NOT provided.", () => {
        // Mocking "document & patch" is not provided.
        req = httpMocks.createRequest({
          method: "POST",
          body: {
            token: "validToken"
            // document
            // patch
          }
        });

        json_patchPath__POST(req, res, next__MOCK);

        expect(next__MOCK).toBeCalledTimes(1);
        expect(next__MOCK.mock.results[0].value.customErrType).toEqual(
          "clientError"
        );
        expect(next__MOCK.mock.results[0].value.statusCode).toEqual(401);
      });

      it("Error Should be handled when 'document' parameter is NOT valid.", () => {
        // Mocking invalid "document".
        req = httpMocks.createRequest({
          method: "POST",
          body: {
            token: "validToken",
            document: "INVALID",
            patch
          }
        });

        json_patchPath__POST(req, res, next__MOCK);

        expect(next__MOCK).toBeCalledTimes(1);
        expect(next__MOCK.mock.results[0].value.customErrType).toEqual(
          "clientError"
        );
        expect(next__MOCK.mock.results[0].value.statusCode).toEqual(401);
      });

      it("Error Should be handled when 'patch' parameter is NOT valid.", () => {
        // Mocking invalid "patch".
        req = httpMocks.createRequest({
          method: "POST",
          body: {
            token: "validToken",
            document,
            patch: "INVALID"
          }
        });

        json_patchPath__POST(req, res, next__MOCK);

        expect(next__MOCK).toBeCalledTimes(1);
        expect(next__MOCK.mock.results[0].value.customErrType).toEqual(
          "clientError"
        );
        expect(next__MOCK.mock.results[0].value.statusCode).toEqual(401);
      });

      it("Error Should be handled when both 'document and patch' parameter is NOT valid.", () => {
        // Mocking invalid "document and patch".
        req = httpMocks.createRequest({
          method: "POST",
          body: {
            token: "validToken",
            document: "INVALID",
            patch: "INVALID"
          }
        });

        json_patchPath__POST(req, res, next__MOCK);

        expect(next__MOCK).toBeCalledTimes(1);
        expect(next__MOCK.mock.results[0].value.customErrType).toEqual(
          "clientError"
        );
        expect(next__MOCK.mock.results[0].value.statusCode).toEqual(401);
      });

      it("Error Should be handled when 'patch' parameter has invalid operation.", () => {
        const invalidPatch = JSON.stringify([
          { op: "IVALID", path: "/firstName", value: "Dwayne" }
        ]);

        // Mocking invalid "document and patch".
        req = httpMocks.createRequest({
          method: "POST",
          body: {
            token: "validToken",
            document,
            patch: invalidPatch
          }
        });

        json_patchPath__POST(req, res, next__MOCK);

        expect(next__MOCK).toBeCalledTimes(1);
        expect(next__MOCK.mock.results[0].value.customErrType).toEqual(
          "clientError"
        );
        expect(next__MOCK.mock.results[0].value.statusCode).toEqual(401);
      });
    });
  });
});
