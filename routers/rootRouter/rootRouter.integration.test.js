const request = require("supertest");
const expressServer = require("../../expressServer");

// Note - Most of below integration test are for just to experiment integration tests. Because most of these test cases already cover in unit tests.

describe("rootRouter", () => {
  describe("With GET request", () => {
    it("Should return status code 200 when successfull.", done => {
      request(expressServer)
        .get("/")
        .expect("Content-Type", /json/)
        .expect(200, done);
    });

    it("Should return JSON body containing '{success: true, ...}' when successfull.", done => {
      request(expressServer)
        .get("/")
        .expect("Content-Type", /json/)
        .then(response => {
          expect(response.body.success).toEqual(true);
          done();
        });
    });

    it("Should return status code 404 and JSON body containing '{success: false, ...}' when requested in POST, DELETE, Etc.", done => {
      request(expressServer)
        .post("/")
        .expect(404)
        .expect("Content-Type", /json/)
        .then(response => {
          expect(response.body.success).toEqual(false);
          done();
        });
    });
  });
});
