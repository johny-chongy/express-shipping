"use strict";

// set up mock
const shipIt = require("../shipItApi");
shipIt.shipProduct = jest.fn();
//TODO: put in beforeAll/each

const request = require("supertest");
const app = require("../app");

describe("POST /", function () {
  test("valid", async function () {
    const shippedId = 1234;
    shipIt.shipProduct.mockReturnValue(shippedId);

    // console.log("calling mocked function: ", shipIt.shipProduct());
    // console.log("mocked function results: ", shipIt.shipProduct.mock.results);

    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      addr: "100 Test St",
      zip: "12345-6789",
    });

    expect(resp.body).toEqual({ shipped: shippedId });
  });

  test("throws error if empty request body", async function () {
    const resp = await request(app)
      .post("/shipments")
      .send();
    expect(resp.statusCode).toEqual(400);
  });

  test("throws error with 1 missing/unexpected key", async function () {
    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      badbody: "Test Tester",
      addr: "100 Test St",
      zip: "12345-6789",
    });

    expect(resp.statusCode).toEqual(400);
  })

  test("throws error where productId < 1000", async function () {
    const resp = await request(app).post("/shipments").send({
      productId: 999,
      name: "Test Tester",
      addr: "100 Test St",
      zip: "12345-6789",
    });

    expect(resp.statusCode).toEqual(400);
  })

});
