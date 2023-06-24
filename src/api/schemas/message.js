export default {
  type: "object",
  properties: {
    conversationId: { type: "string", format: "mongoObjectId" },
    personId: { type: "string", format: "mongoObjectId" },
    messageContent: { type: "object" },
    createdAt: { type: "string", format: "date-time" },
    isFromUser: { type: "boolean" },
  },
  required: ["conversationId", "personId", "messageContent", "isFromUser"],
  additionalProperties: false,
};
