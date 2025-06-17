const request = require("supertest");
const app = require("../server");

describe("Logs API", () => {
  test("GET /logs should return all logs", async () => {
    const res = await request(app).get("/logs");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /logs with status_code filter should return filtered logs", async () => {
    const res = await request(app).get("/logs").query({ status_code: "OK" });
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((logEntry) => {
      expect(logEntry.status_code).toBe("OK");
    });
  });
});
