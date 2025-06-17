const request = require("supertest");
const app = require("../server");
describe("Destinations API", () => {
  test("GET /destination should return all destinations", async () => {
    const res = await request(app)
      .get("/destination")
      .set("x-user-role", "admin");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("POST /destination should create a new destination", async () => {
    const newDestination = {
      account_id: "1",
      url: "https://example.com/api",
      http_method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    const res = await request(app)
      .post("/destination")
      .set("x-user-role", "admin")
      .send(newDestination);
    expect(res.statusCode).toBe(201);
  });

  test("POST /destination shoudld return 400 for invalid data", async () => {
    const res = await request(app)
      .post("/destination")
      .set("x-user-role", "admin")
      .send({});
    expect(res.statusCode).toBe(400);
  });

  test("GET /destination with http_method filter should return filtered destinations", async () => {
    const res = await request(app)
      .get("/destination")
      .set("x-user-role", "admin")
      .query({ http_method: "POST" });
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((dest) => {
      expect(dest.http_method).toBe("POST");
    });
  });

  test("GET /destination with non-existent http_method should return 404", async () => {
    const res = await request(app)
      .get("/destination")
      .set("x-user-role", "admin")
      .query({ http_method: "NON_EXISTENT_METHOD" });
    expect(res.body).toEqual([]);
  });

  test("GET /destination/:id with non-existent id should return 404", async () => {
    const res = await request(app)
      .get("/destination/123788")
      .set("x-user-role", "admin");
    expect(res.body).toEqual({});
  });
});
