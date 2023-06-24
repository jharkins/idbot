import supertest from "supertest";
import { jest } from "@jest/globals"; // eslint-disable-line

import app from "../../../src/app.js";
import MessageService from "../../../src/services/message.js";
import UserService from "../../../src/services/user.js";

jest.mock("../../../src/services/message.js");
jest.mock("../../../src/services/user.js");

UserService.authenticateWithToken = jest
  .fn()
  .mockResolvedValue({ email: "test@example.com" });

describe("/api/v1/message/", () => {
  test("anonymous requests are blocked", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/message");
    expect(res.status).toBe(401);
  });

  test("GET lists all the models", async () => {
    const data = [{ name: "First" }, { name: "Second" }];
    MessageService.list = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get("/api/v1/message")
      .set("Authorization", "token abc");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
    expect(MessageService.list).toHaveBeenCalled();
  });

  test("POST creates a new Message", async () => {
    const data = {
      conversationId: "614c2c2a29d7763052c63810",
      personId: "614c2c2a29d7763052c63810",
      messageContent: { foo: "bar" },
      createdAt: "2001-01-01T00:00:00Z",
      isFromUser: true,
    };

    MessageService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/message")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.body).toEqual(data);
    expect(res.status).toBe(201);
    expect(MessageService.create).toHaveBeenCalledWith(data);
  });

  test("creating a new Message without required attributes fails", async () => {
    const data = {};

    MessageService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/message")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(MessageService.create).not.toHaveBeenCalled();
  });
});

describe("/api/v1/message/:id", () => {
  test("getting a single result succeeds for authorized user", async () => {
    const data = { email: "test@example.com" };
    MessageService.get = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/message/507f1f77bcf86cd799439011`)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(MessageService.get).toHaveBeenCalledWith("507f1f77bcf86cd799439011");
  });

  test("getting a single result fails for anonymous user", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/message/507f1f77bcf86cd799439011");
    expect(res.status).toBe(401);
  });

  test("request for nonexistent object returns 404", async () => {
    const id = "507f1f77bcf86cd799439011";
    MessageService.get = jest.fn().mockResolvedValue(null);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/message/${id}`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(404);
    expect(MessageService.get).toHaveBeenCalled();
  });

  test("request with incorrectly-formatted ObjectId fails", async () => {
    MessageService.get = jest.fn();
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/message/bogus`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(400);
    expect(MessageService.get).not.toHaveBeenCalled();
  });

  test("Message update", async () => {
    const data = {
      conversationId: "614c2c2a29d7763052c63810",
      personId: "614c2c2a29d7763052c63810",
      messageContent: { foo: "bar" },
      isFromUser: true,
    };
    MessageService.update = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .put(`/api/v1/message/507f1f77bcf86cd799439011`)
      .send(data)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(MessageService.update).toHaveBeenCalledWith(
      "507f1f77bcf86cd799439011",
      data
    );
  });

  test("Message deletion", async () => {
    MessageService.delete = jest.fn().mockResolvedValue(true);
    const req = supertest(app);

    const res = await req
      .delete(`/api/v1/message/507f1f77bcf86cd799439011`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(204);
    expect(MessageService.delete).toHaveBeenCalledWith(
      "507f1f77bcf86cd799439011"
    );
  });
});
