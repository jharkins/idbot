import mongoose from "mongoose";

import { handleDuplicateKeyError } from "./error.js";

const schema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.ObjectId,
      required: true,
      ref: "Conversation",
    },
    personId: {
      type: mongoose.ObjectId,
      required: true,
      ref: "Person",
    },
    messageContent: {
      type: Object,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    isFromUser: {
      type: Boolean,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

schema.post("save", handleDuplicateKeyError);
schema.post("update", handleDuplicateKeyError);
schema.post("findOneAndUpdate", handleDuplicateKeyError);
schema.post("insertMany", handleDuplicateKeyError);

const Message = mongoose.model("Message", schema);

export default Message;
