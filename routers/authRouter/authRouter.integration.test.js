const request = require("supertest");
const expressServer = require("../../expressServer");

// Note - Most of below integration test are for just to experiment integration tests. Because most of these test cases already cover in unit tests.

describe("Router - '/auth'", () => {
  describe("Path - 'POST /auth/login'", () => {
    describe("When all credentials (username & password) provided successfully.", () => {
      it("Should return status code 200.", done => {
        request(expressServer)
          .post("/auth/login")
          .send({ username: "johndoe@gmail.com", password: "mySuperPassword" })
          .expect("Content-Type", /json/)
          .expect(200, done);
      });

      it("Should return JSON body containing '{success : true, token: ..., username: ...}.'", done => {
        request(expressServer)
          .post("/auth/login")
          .send({ username: "johndoe@gmail.com", password: "mySuperPassword" })
          .expect("Content-Type", /json/)
          .then(response => {
            expect(response.body.success).toEqual(true);
            expect(response.body.username).toEqual("johndoe@gmail.com");
            expect(response.body).toHaveProperty("token");
            done();
          });
      });

      it("Should return status code 404 and JSON body containing '{success: false, ...}' when requested in GET, DELETE, Etc.", done => {
        request(expressServer)
          .get("/auth/login")
          .send({ username: "johndoe@gmail.com", password: "mySuperPassword" })
          .expect(404)
          .expect("Content-Type", /json/)
          .then(response => {
            expect(response.body.success).toEqual(false);
            done();
          });
      });
    });

    describe("When some credentials NOT provided", () => {
      it("Should return status code 401 and JSON body containing {success: false, errMsg:...} when username is not provided.", done => {
        request(expressServer)
          .post("/auth/login")
          .send({ password: "mySuperPassword" })
          .expect(401)
          .expect("Content-Type", /json/)
          .then(response => {
            expect(response.body.success).toEqual(false);
            done();
          });
      });

      it("Should return status code 401 and JSON body containing {success: false, errMsg:...} when password is not provided.", done => {
        request(expressServer)
          .post("/auth/login")
          .send({ username: "johndoe@gmail.com" })
          .expect(401)
          .expect("Content-Type", /json/)
          .then(response => {
            expect(response.body.success).toEqual(false);
            done();
          });
      });

      it("Should return status code 401 and JSON body containing {success: false, errMsg:...} when both username & password is not provided.", done => {
        request(expressServer)
          .post("/auth/login")
          .send({})
          .expect(401)
          .expect("Content-Type", /json/)
          .then(response => {
            expect(response.body.success).toEqual(false);
            done();
          });
      });

      it("Should return status code 500 and JSON body containing {success: false, errMsg:...} when some other error occured while processing request", done => {
        request(expressServer)
          .post("/auth/login")
          .send({ username: "johndoe@gmail.com" })
          .expect(401)
          .expect("Content-Type", /json/)
          .then(response => {
            expect(response.body.success).toEqual(false);
            done();
          });
      });
    });
  });

  describe("Path - 'POST /auth/tokenValidator'", () => {
    let validToken;
    const invalidToken = "THIS IS NOT VALID";

    beforeAll(done => {
      // Getting valid token first.
      request(expressServer)
        .post("/auth/login")
        .send({ username: "johndoe@gmail.com", password: "mySuperPassword" })
        .expect("Content-Type", /json/)
        .then(response => {
          const { token } = response.body;
          validToken = token;
          done();
        });
    });

    describe("When valid token is provided.", () => {
      it("Should return status code 200 and JSON body containing {success: true, msg:..., username:...., issuedAt:... expiredAt:....}. when successfully authenticated.", done => {
        request(expressServer)
          .post("/auth/tokenValidator")
          .send({ token: validToken })
          .expect(200)
          .expect("Content-Type", /json/)
          .then(response => {
            expect(response.body.success).toEqual(true);
            expect(response.body.username).toEqual("johndoe@gmail.com");
            expect(response.body).toHaveProperty("msg");
            expect(response.body).toHaveProperty("issuedAt");
            expect(response.body).toHaveProperty("expireAt");
            done();
          });
      });
    });

    describe("When valid token is NOT provided.", () => {
      it("Should return status code 401 and JSON body containing {success: false, errMsg:...}. when JWT authentication failed.", done => {
        request(expressServer)
          .post("/auth/tokenValidator")
          .send({ token: invalidToken })
          .expect(401)
          .expect("Content-Type", /json/)
          .then(response => {
            expect(response.body.success).toEqual(false);
            expect(response.body).toHaveProperty("errMsg");
            done();
          });
      });
    });
  });
});
