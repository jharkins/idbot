export default {
  type: "object",
  properties: {
    name: { type: "string" },
    email: { type: "string", format: "email" },
    mobilePhone: { type: "string" },
  },
  required: ["name", "email", "mobilePhone"],
  additionalProperties: false,
};
