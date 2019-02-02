const httpMocks = require("node-mocks-http");
const passport = require("passport");

require("../../passport/passportStrategies");
const {
  auth_loginPath__POST,
  auth_tokenValidatorPath__POST
} = require("./authRouterController");

const handleCustomError = require("../../errorHandlers/handleCustomError");

describe("Router Controller - '/auth/'", () => {
  describe("Path - 'POST /auth/login' (Handled By Passport LoginAutenticator)", () => {
    describe("When all credentials provided successfully.", () => {
      let req;
      let res;
      let next__MOCK;

      beforeEach(() => {
        // Mocking successfull request.
        req = httpMocks.createRequest({
          method: "POST",
          body: {
            username: "johndoe@gmail.com",
            password: "mySuperSecret"
          }
        });

        res = httpMocks.createResponse();

        next__MOCK = jest.fn();
      });

      afterEach(() => {
        // Resetting mocking objects.
        req = "";
        res = "";
        next__MOCK.mockReset();
      });

      it("Should return status code 200 when successfull.", () => {
        auth_loginPath__POST(req, res, next__MOCK);

        expect(res.statusCode).toEqual(200);
      });

      it("Should return JSON containing {success : true, token: ..., username: ...}.", () => {
        auth_loginPath__POST(req, res, next__MOCK);

        const responseData = JSON.parse(res._getData());

        expect(responseData.success).toEqual(true);
        expect(responseData.username).toEqual("johndoe@gmail.com");
        expect(responseData).toHaveProperty("token");
      });
    });

    describe("When some credentials NOT provided and error is handled by handleCustomError().", () => {
      let req;
      let res;
      let next__MOCK;

      beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next__MOCK = jest.fn().mockImplementation(errResult => errResult);
      });

      afterEach(() => {
        // Resetting mocking objects.
        req = "";
        res = "";
        next__MOCK.mockReset();
      });

      it("Should return error with status code 401 when username is not provided.", () => {
        // Mocking unsuccessfull request.
        req = httpMocks.createRequest({
          method: "POST",
          body: {
            password: "mySuperSecret"
          }
        });

        auth_loginPath__POST(req, res, next__MOCK);

        expect(next__MOCK).toBeCalledTimes(1);
        expect(next__MOCK.mock.results[0].value.customErrType).toEqual(
          "clientError"
        );
        expect(next__MOCK.mock.results[0].value.statusCode).toEqual(401);
      });

      it("Should return error with status code 401 when password is not provided.", () => {
        // Mocking unsuccessfull request.
        req = httpMocks.createRequest({
          method: "POST",
          body: {
            username: "johndoe@gmail.com"
          }
        });

        auth_loginPath__POST(req, res, next__MOCK);

        expect(next__MOCK).toBeCalledTimes(1);
        expect(next__MOCK.mock.results[0].value.customErrType).toEqual(
          "clientError"
        );
        expect(next__MOCK.mock.results[0].value.statusCode).toEqual(401);
      });

      it("Should return error with status code 401 when both username and password is not provided.", () => {
        // Mocking unsuccessfull request.
        req = httpMocks.createRequest({
          method: "POST",
          body: {}
        });

        auth_loginPath__POST(req, res, next__MOCK);

        expect(next__MOCK).toBeCalledTimes(1);
        expect(next__MOCK.mock.results[0].value.customErrType).toEqual(
          "clientError"
        );
        expect(next__MOCK.mock.results[0].value.statusCode).toEqual(401);
      });
    });
  });

  describe("Path - 'POST /auth/tokenValidator'", () => {
    describe("When Path Already validated by JWT Authentication", () => {
      let req;
      let res;

      // Devided by 1000 to get seconds.
      const issuedTime = new Date() / 1000;
      const expiredTime = new Date() / 1000 + 3600;

      beforeEach(() => {
        // Mocking successfull request with Passport JWT Authtication item populated.
        req = httpMocks.createRequest({
          method: "POST"
        });

        // This normally auto populate from passport when JWT Authentication Successful.
        req.user = {
          id: "johndoe@gmail.com",
          iat: issuedTime,
          exp: expiredTime
        };

        res = httpMocks.createResponse();
      });

      afterEach(() => {
        // Resetting mocking objects.
        req = "";
        res = "";
      });

      it("Should return status code 200.", () => {
        auth_tokenValidatorPath__POST(req, res);

        expect(res.statusCode).toEqual(200);
      });

      it("Should return JSON body containing {success: true, msg:..., username:...., issuedAt:... expiredAt:....}.", () => {
        auth_tokenValidatorPath__POST(req, res);

        const responseData = JSON.parse(res._getData());

        expect(responseData.success).toEqual(true);
        expect(responseData.username).toEqual("johndoe@gmail.com");
        expect(responseData.issuedAt).toEqual(
          new Date(issuedTime * 1000).toISOString()
        );
        expect(responseData.expireAt).toEqual(
          new Date(expiredTime * 1000).toISOString()
        );
        expect(responseData).toHaveProperty("msg");
      });
    });
  });
});
