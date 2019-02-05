const httpMocks = require("node-mocks-http");
const axios = require("axios");
const AxiosMockAdapter = require("axios-mock-adapter");
const fs = require("fs");
const path = require("path");

const imageDownloadAndResizeUtility = require("./helpers/imageDownloadAndResizeUtility");

const { image_thumbnailPath__POST } = require("./imageRouterController");

const axiosMock = new AxiosMockAdapter(axios);

describe("Router Controller - '/image'", () => {
  describe("Path - '/image/thumbnail'", () => {
    describe("When path is already JWT validated (token) and the neccessary parameters (imageURL) are provided and valid.", () => {
      let req;
      let res;
      beforeEach(() => {
        // Dummy valid imageURL. Any request to this URL get mocked.
        const validImageURL =
          "https://www.wikimedia.org/static/images/project-logos/enwiki-1.5x.png";

        axiosMock
          .onGet(
            "https://www.wikimedia.org/static/images/project-logos/enwiki-1.5x.png"
          )
          .passThrough();

        // Mocking successfull request.
        req = httpMocks.createRequest({
          method: "POST",
          body: {
            token: "VALID TOKEN",
            imageURL: validImageURL
          }
        });

        res = httpMocks.createResponse({
          eventEmitter: require("events").EventEmitter
        });
      });
      afterEach(() => {
        // Resetting mocking objects.
        req = "";
        res = "";
        axiosMock.reset();
      });
      it("Should return status code 200.", () => {
        image_thumbnailPath__POST(req, res);
        expect(res.statusCode).toEqual(200);
      });
    });

    describe("When path is already JWT validated (token) but the neccessary parameters (imageURL) are not provided or valid.", () => {
      let req;
      let res;
      let next__MOCK;

      const validImageURL =
        "https://www.wikimedia.org/static/images/project-logos/enwiki-1.5x.png";

      beforeEach(() => {
        next__MOCK = jest.fn().mockImplementation(errResult => errResult);

        res = httpMocks.createResponse({
          eventEmitter: require("events").EventEmitter
        });
      });

      afterEach(() => {
        // Resetting mocking objects.
        req = "";
        res = "";
        axiosMock.restore();
        next__MOCK.mockReset();
      });

      it("Error Should be handled when 'imageURL' parameter is NOT provided.", () => {
        // Mocking imageURL not provided.
        req = httpMocks.createRequest({
          method: "POST",
          body: {
            token: "VALID TOKEN"
            // imageURL: validImageURL
          }
        });

        image_thumbnailPath__POST(req, res, next__MOCK);

        expect(next__MOCK).toBeCalledTimes(1);
        expect(next__MOCK.mock.results[0].value.customErrType).toEqual(
          "clientError"
        );
        expect(next__MOCK.mock.results[0].value.statusCode).toEqual(401);
      });

      it("Error Should be handled when 'imageURL' parameter is NOT valid.", () => {
        // Mocking imageURL not valid.
        req = httpMocks.createRequest({
          method: "POST",
          body: {
            token: "VALID TOKEN",
            imageURL: "INVALID URL"
          }
        });

        image_thumbnailPath__POST(req, res, next__MOCK);

        expect(next__MOCK).toBeCalledTimes(1);
        expect(next__MOCK.mock.results[0].value.customErrType).toEqual(
          "clientError"
        );
        expect(next__MOCK.mock.results[0].value.statusCode).toEqual(401);
      });

      it("Error Should be handled when 'width' parameter is NOT a valid number.", () => {
        // Mocking width is not a number.
        req = httpMocks.createRequest({
          method: "POST",
          body: {
            token: "VALID TOKEN",
            imageURL: validImageURL,
            width: "NOT A NUBMER"
          }
        });

        // Catching throwed error by error handler.
        try {
          image_thumbnailPath__POST(req, res, next__MOCK);
        } catch (err) {
          expect(err.customErrType).toEqual("clientError");
          expect(err.statusCode).toEqual(401);
        }
      });

      it("Error Should be handled when 'height' parameter is NOT a valid number.", () => {
        // Mocking width is not a number.
        req = httpMocks.createRequest({
          method: "POST",
          body: {
            token: "VALID TOKEN",
            imageURL: validImageURL,
            height: "NOT A NUBMER"
          }
        });

        // Catching throwed error by error handler.
        try {
          image_thumbnailPath__POST(req, res, next__MOCK);
        } catch (err) {
          expect(err.customErrType).toEqual("clientError");
          expect(err.statusCode).toEqual(401);
        }
      });
    });
  });
});
