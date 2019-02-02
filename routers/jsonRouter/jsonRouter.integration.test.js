const request = require("supertest");
const expressServer = require("../../expressServer");

// Note - Most of below integration test are for just to experiment integration tests. Because most of these test cases already cover in unit tests.

describe("Router - '/json'", () => {
  describe("Path - 'POST /json/patch'", () => {
    let validToken;
    const validDocument = JSON.stringify({
      firstName: "John",
      lastName: "Doe"
    });

    const validPatch = JSON.stringify([
      { op: "replace", path: "/firstName", value: "Dwayne" }
    ]);

    beforeAll(done => {
      // Getting valid token first.
      request(expressServer)
        .post("/auth/login")
        .send({
          username: "johndoe@gmail.com",
          password: "mySuperPassword"
        })
        .expect("Content-Type", /json/)
        .then(response => {
          const { token } = response.body;
          validToken = token;
          done();
        });
    });

    describe("When all credentials (token, document & patch) provided successfully.", () => {
      it("Should return status code 200.", done => {
        request(expressServer)
          .post("/json/patch")
          .send({
            token: validToken,
            document: validDocument,
            patch: validPatch
          })
          .expect("Content-Type", /json/)
          .expect(200, done);
      });

      it("Should return JSON body containing '{success : true, patchedDocument: ...}.'", done => {
        request(expressServer)
          .post("/json/patch")
          .send({
            token: validToken,
            document: validDocument,
            patch: validPatch
          })
          .expect("Content-Type", /json/)
          .then(response => {
            expect(response.body.success).toEqual(true);
            expect(response.body.patchedDocument).toEqual({
              firstName: "Dwayne",
              lastName: "Doe"
            });
            done();
          });
      });

      it("Should return status code 404 and JSON body containing '{success: false, ...}' when requested in GET, DELETE, Etc.", done => {
        request(expressServer)
          .get("/json/patch")
          .send({
            token: validToken,
            document: validDocument,
            patch: validPatch
          })
          .expect(404)
          .expect("Content-Type", /json/)
          .then(response => {
            expect(response.body.success).toEqual(false);
            done();
          });
      });
    });

    describe("When some credentials NOT provided", () => {
      it("Should return status code 401 and JSON body containing {success: false, errMsg:...} when token is not provided.", done => {
        request(expressServer)
          .post("/json/patch")
          .send({
            token: "INVALID TOKEN",
            document: validDocument,
            patch: validPatch
          })
          .expect(401)
          .expect("Content-Type", /json/)
          .then(response => {
            expect(response.body.success).toEqual(false);
            done();
          });
      });

      it("Should return status code 401 and JSON body containing {success: false, errMsg:...} when document is not provided.", done => {
        request(expressServer)
          .post("/json/patch")
          .send({
            token: validToken,
            patch: validPatch
          })
          .expect(401)
          .expect("Content-Type", /json/)
          .then(response => {
            expect(response.body.success).toEqual(false);
            done();
          });
      });

      it("Should return status code 401 and JSON body containing {success: false, errMsg:...} when patch is not provided.", done => {
        request(expressServer)
          .post("/json/patch")
          .send({
            token: validToken,
            document: validDocument
          })
          .expect(401)
          .expect("Content-Type", /json/)
          .then(response => {
            expect(response.body.success).toEqual(false);
            done();
          });
      });

      it("Should return status code 401 and JSON body containing {success: false, errMsg:...} when both document and patch is not provided.", done => {
        request(expressServer)
          .post("/json/patch")
          .send({
            token: validToken
          })
          .expect(401)
          .expect("Content-Type", /json/)
          .then(response => {
            expect(response.body.success).toEqual(false);
            done();
          });
      });

      it("Should return status code 401 and JSON body containing {success: false, errMsg:...} when document is invalid.", done => {
        request(expressServer)
          .post("/json/patch")
          .send({
            token: validToken,
            document: "INVALID DOCUMENT",
            patch: validPatch
          })
          .expect(401)
          .expect("Content-Type", /json/)
          .then(response => {
            expect(response.body.success).toEqual(false);
            done();
          });
      });

      it("Should return status code 401 and JSON body containing {success: false, errMsg:...} when patch is invalid.", done => {
        request(expressServer)
          .post("/json/patch")
          .send({
            token: validToken,
            document: validDocument,
            patch: "INVALID PATCH"
          })
          .expect(401)
          .expect("Content-Type", /json/)
          .then(response => {
            expect(response.body.success).toEqual(false);
            done();
          });
      });

      it("Should return status code 401 and JSON body containing {success: false, errMsg:...} when both document and patch is invalid.", done => {
        request(expressServer)
          .post("/json/patch")
          .send({
            token: validToken,
            document: "INVALID DOCUMENT",
            patch: "INVALID PATCH"
          })
          .expect(401)
          .expect("Content-Type", /json/)
          .then(response => {
            expect(response.body.success).toEqual(false);
            done();
          });
      });

      it("Should return status code 401 and JSON body containing {success: false, errMsg:...} when patch has invalid operation.", done => {
        const invalidPatch = JSON.stringify([
          { op: "INVALID OPERATION", path: "/firstName", value: "Dwayne" }
        ]);

        request(expressServer)
          .post("/json/patch")
          .send({
            token: validToken,
            document: validDocument,
            patch: invalidPatch
          })
          .expect(401)
          .expect("Content-Type", /json/)
          .then(response => {
            expect(response.body.success).toEqual(false);
            done();
          });
      });

      it("Should return status code 401 and JSON body containing {success: false, errMsg:...} when patch has invalid path.", done => {
        const invalidPatch = JSON.stringify([
          { op: "replace", path: "INVALID PATH", value: "Dwayne" }
        ]);

        request(expressServer)
          .post("/json/patch")
          .send({
            token: validToken,
            document: validDocument,
            patch: invalidPatch
          })
          .expect(401)
          .expect("Content-Type", /json/)
          .then(response => {
            expect(response.body.success).toEqual(false);
            done();
          });
      });
    });
  });
});
