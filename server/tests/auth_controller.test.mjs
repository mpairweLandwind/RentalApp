import request from "supertest";
import app from "../index.js"
import prisma from "../lib/prisma.mjs";

describe("Auth Controller", () => {
  beforeAll(async () => {
    // clear test users before running
    await prisma.listing.deleteMany({});
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    if (app && typeof app.close === 'function') {
      await new Promise(resolve => app.close(resolve));
    }
    await prisma.$disconnect();
  });

  test("should register a new user successfully", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({
        email: "testuser@example.com",
        image: "test.png",
        password: "12345678"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("email", "testuser@example.com");
  });

  test("should not allow duplicate registration", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({
        email: "testuser@example.com",
        image: "test.png",
        password: "12345678"
      });

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toMatch(/already registered/i);
  });
});
