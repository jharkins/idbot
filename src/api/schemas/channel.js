export default {
  type: "object",
  properties: {
    type: { type: "string" },
    details: { type: "object" },
    isActive: { type: "boolean" },
  },
  required: ["type"],
  additionalProperties: false,
};
