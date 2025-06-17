const request = require("supertest");
const app = require("../server");

describe("Accounts API -", () => {
  test("GET /accounts should return all accounts", async () => {
    const res = await request(app).get("/account").set("x-user-role", "admin"); // Added header for admin role
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
  test("POST /accounts should create a new account", async () => {
    const newAccount = {
      email: "test@gmail.com",
      app_secret_token: "password",
      account_name: "Test Account",
      account_id: "12345",
    };
    const res = await request(app)
      .post("/account")
      .set("x-user-role", "admin")
      .send(newAccount);
    expect(res.statusCode).toBe(201);
  });
  test("GET /accounts with email query should return filtered accounts", async () => {
    const res = await request(app)
      .get("/account")
      .set("x-user-role", "admin")
      .query({ email: "test@gmail.com" });
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
  test("GET /accounts with non-existent email should return empty array", async () => {
    const res = await request(app)
      .get("/account")
      .set("x-user-role", "admin")
      .query({ email: "hfusd@gmail.com" });
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({
      error: "No accounts found with the specified email",
    });
  });
  test("PUT /accounts/:id should update an account", async () => {
    const updatedAccount = {
      email: "testdjf@gmail.com",
    };
    const res = await request(app)
      .put("/account/12345")
      .set("x-user-role", "admin")
      .send(updatedAccount);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Account updated successfully");
  });
  test("PUT /accounts/:id with non-existent account should return 404", async () => {
    const updatedAccount = {
      email: "testerie@gmail.com",
    };
    const res = await request(app)
      .put("/account/99999")
      .set("x-user-role", "admin")
      .send(updatedAccount);
    expect(res.body.error).toBe("Account not found");
  });
  test("DELETE /accounts/:id should delete an account", async () => {
    const res = await request(app)
      .delete("/account/12345")
      .set("x-user-role", "admin");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Account and its destinations deleted");
  });
  test("DELETE /accounts/:id with non-existent account should return 404", async () => {
    const res = await request(app)
      .delete("/account/99999")
      .set("x-user-role", "admin");
    expect(res.body.error).toBe("Account not found");
  });
});
