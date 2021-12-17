const request = require("supertest");
const db = require("./../data/dbConfig");
const server = require("./server");
const jokes = require("./jokes/jokes-data");
const bcrypt = require("bcryptjs");
const { BCRYPT_ROUNDS } = require("./../config");

const invalidAuthOne = { username: "", password: "1234" };
const invalidAuthTwo = { username: "bob", password: "" };

const validAuthOne = { username: "bob", password: "1234" };

beforeEach(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

afterAll(async () => {
  await db.destroy();
});

test("sanity", () => {
  expect(true).not.toBe(false);
});

test("correct env?", () => {
  expect(process.env.NODE_ENV).toBe("testing");
});

describe("registration endpoint", () => {
  it("returns correct error message if req body lacks username", async () => {
    const res = await request(server)
      .post("/api/auth/register")
      .send(invalidAuthOne);
    expect(res.body.message).toBe("username and password required");
  });
  it("returns correct error message if req body lacks password", async () => {
    const res = await request(server)
      .post("/api/auth/register")
      .send(invalidAuthTwo);
    expect(res.body.message).toBe("username and password required");
  });
  it("successfully creates account", async () => {
    await request(server).post("/api/auth/register").send(validAuthOne);
    const [user] = await db("users").where({ username: validAuthOne.username });
    expect(user).toMatchObject({ username: "bob" });
  });
});

describe("login endpoint", () => {
  beforeEach(async () => {
    const hash = bcrypt.hashSync(validAuthOne.password, BCRYPT_ROUNDS);
    await db("users").insert({
      username: validAuthOne.username,
      password: hash,
    });
  });
  it("user can successfully login with correct credentials", async () => {
    const res = await request(server)
      .post("/api/auth/login")
      .send(validAuthOne);
    expect(res.body.message).toBe("welcome, bob");
  });
  it("does not login user witout password", async () => {
    const res = await request(server)
      .post("/api/auth/login")
      .send(invalidAuthTwo);
    expect(res.body.message).toBe("username and password required");
  });
});

describe("jokes endpoint", () => {
  beforeEach(async () => {
    const hash = bcrypt.hashSync(validAuthOne.password, BCRYPT_ROUNDS);
    await db("users").insert({
      username: validAuthOne.username,
      password: hash,
    });
  });
  it("user without a token cannot see jokes", async () => {
    const res = await request(server).get("/api/jokes");
    expect(res.body.message).toBe("token required");
  });
  it("user without a valid token can see jokes", async () => {
    let res = await request(server).post("/api/auth/login").send(validAuthOne);
    res = await request(server)
      .get("/api/jokes")
      .set("Authorization", res.body.token);
    expect(res.body).toMatchObject(jokes);
  });
});
