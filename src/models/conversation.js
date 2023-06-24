import mongoose from "mongoose";

import { handleDuplicateKeyError } from "./error.js";

const schema = new mongoose.Schema(
  {
    personId: {
      type: mongoose.ObjectId,
      required: true,
      ref: "Person",
    },
    channelId: {
      type: mongoose.ObjectId,
      required: true,
      ref: "Channel",
    },
    isActive: {
      type: Boolean,
      default: true,
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

const Conversation = mongoose.model("Conversation", schema);

export default Conversation;
