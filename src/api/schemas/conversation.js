export default {
  type: "object",
  properties: {
    personId: { type: "string", format: "mongoObjectId" },
    channelId: { type: "string", format: "mongoObjectId" },
    isActive: { type: "boolean" },
  },
  required: ["personId", "channelId"],
  additionalProperties: false,
};
