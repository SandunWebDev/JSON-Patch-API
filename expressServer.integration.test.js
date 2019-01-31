const request = require("supertest");
const expressServer = require("./expressServer");

describe("Express Server Starting Point", () => {
  it("Should handle requests to Root Path sucessfully.", done => {
    request(expressServer)
      .get("/")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });

  it("Should handle non existence path gracefully, by sending status code 404 and {success: false, ...}.", done => {
    request(expressServer)
      .get("/thisPathDontExist")
      .expect(404)
      .expect("Content-Type", /json/)
      .then(response => {
        expect(response.body.success).toEqual(false);
        done();
      });
  });
});
