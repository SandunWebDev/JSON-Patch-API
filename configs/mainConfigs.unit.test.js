const dotenv = require("dotenv");

describe(".env Configuration Handling ", () => {
  // Mocking .env file reading done by "dotenv" module.
  const dotenv__MOCK = jest.spyOn(dotenv, "config");

  it("Values in .env file should be found in config object.", () => {
    // Mocking .env file values.
    dotenv__MOCK.mockReturnValue({
      parsed: { ABC: "HELLO" }
    });

    const config = require("./mainConfigs");

    expect(config.ABC).toEqual("HELLO");

    dotenv__MOCK.mockReset();
  });
});
