const request = require("supertest");
const app = require("../server");

describe("Account Members API", () => {
  test("GET /accountMember should return all account members", async () => {
    const res = await request(app)
      .get("/accountMember")
      .set("x-user-role", "admin");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("POST /accountMember should create a new account member", async () => {
    const newMember = {
      account_id: "12345",
      role_id: "1",
      user_id: "1",
    };
    const res = await request(app)
      .post("/accountMember")
      .set("x-user-role", "admin")
      .send(newMember);
    expect(res.statusCode).toBe(201);
  });

  test("POST /accountMember should return 400 for invalid data", async () => {
    const res = await request(app)
      .post("/accountMember")
      .set("x-user-role", "admin")
      .send({});
    expect(res.statusCode).toBe(400);
  });

  test("GET /accountMember/account/:accountId should return members for specific account", async () => {
    const res = await request(app)
      .get("/accountMember/account/12345")
      .set("x-user-role", "admin");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("PUT /accountMember/:id should update an account member", async () => {
    const updatedMember = {
      role_id: "2",
    };
    const res = await request(app)
      .put("/accountMember/2")
      .set("x-user-role", "admin")
      .send(updatedMember);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Member updated successfully");
  });

  test("PUT /accountMember/:id with non-existent member should return 404", async () => {
    const updatedMember = {
      role_id: "2",
    };
    const res = await request(app)
      .put("/accountMember/99999")
      .set("x-user-role", "admin")
      .send(updatedMember);
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Member not found");
  });

  test("DELETE /accountMember/:id should delete an account member", async () => {
    const res = await request(app)
      .delete("/accountMember/2")
      .set("x-user-role", "admin");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Member deleted successfully");
  });

  test("DELETE /accountMember/:id with non-existent member should return 404", async () => {
    const res = await request(app)
      .delete("/accountMember/99999")
      .set("x-user-role", "admin");
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Member not found");
  });
});
