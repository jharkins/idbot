import supertest from "supertest";
import { jest } from "@jest/globals"; // eslint-disable-line

import app from "../../../src/app.js";
import ChannelService from "../../../src/services/channel.js";
import UserService from "../../../src/services/user.js";

jest.mock("../../../src/services/channel.js");
jest.mock("../../../src/services/user.js");

UserService.authenticateWithToken = jest
  .fn()
  .mockResolvedValue({ email: "test@example.com" });

describe("/api/v1/channel/", () => {
  test("anonymous requests are blocked", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/channel");
    expect(res.status).toBe(401);
  });

  test("GET lists all the models", async () => {
    const data = [{ name: "First" }, { name: "Second" }];
    ChannelService.list = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get("/api/v1/channel")
      .set("Authorization", "token abc");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
    expect(ChannelService.list).toHaveBeenCalled();
  });

  test("POST creates a new Channel", async () => {
    const data = {
      type: "test",
      details: { foo: "bar" },
      isActive: true,
    };

    ChannelService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/channel")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.body).toEqual(data);
    expect(res.status).toBe(201);
    expect(ChannelService.create).toHaveBeenCalledWith(data);
  });

  test("creating a new Channel without required attributes fails", async () => {
    const data = {};

    ChannelService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/channel")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(ChannelService.create).not.toHaveBeenCalled();
  });
});

describe("/api/v1/channel/:id", () => {
  test("getting a single result succeeds for authorized user", async () => {
    const data = { email: "test@example.com" };
    ChannelService.get = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/channel/507f1f77bcf86cd799439011`)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(ChannelService.get).toHaveBeenCalledWith("507f1f77bcf86cd799439011");
  });

  test("getting a single result fails for anonymous user", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/channel/507f1f77bcf86cd799439011");
    expect(res.status).toBe(401);
  });

  test("request for nonexistent object returns 404", async () => {
    const id = "507f1f77bcf86cd799439011";
    ChannelService.get = jest.fn().mockResolvedValue(null);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/channel/${id}`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(404);
    expect(ChannelService.get).toHaveBeenCalled();
  });

  test("request with incorrectly-formatted ObjectId fails", async () => {
    ChannelService.get = jest.fn();
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/channel/bogus`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(400);
    expect(ChannelService.get).not.toHaveBeenCalled();
  });

  test("Channel update", async () => {
    const data = {
      type: "test",
    };
    ChannelService.update = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .put(`/api/v1/channel/507f1f77bcf86cd799439011`)
      .send(data)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(ChannelService.update).toHaveBeenCalledWith(
      "507f1f77bcf86cd799439011",
      data
    );
  });

  test("Channel deletion", async () => {
    ChannelService.delete = jest.fn().mockResolvedValue(true);
    const req = supertest(app);

    const res = await req
      .delete(`/api/v1/channel/507f1f77bcf86cd799439011`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(204);
    expect(ChannelService.delete).toHaveBeenCalledWith(
      "507f1f77bcf86cd799439011"
    );
  });
});
