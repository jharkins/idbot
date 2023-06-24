export default {
  apiPrefix: "/api/v1",
  swagger: {
    path: "/api/docs",
    spec: "openapi.json",
  },
  auth: {
    path: "/auth",
    login: "/login",
    logout: "/logout",
    changePassword: "/password",
    register: "/register",
  },
  person: {
    path: "/person",
  },
  channel: {
    path: "/channel",
  },
  conversation: {
    path: "/conversation",
  },
  message: {
    path: "/message",
  },
};
