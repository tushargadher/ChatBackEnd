import { Schema as _Schema, model } from "mongoose";
import { Schema } from "mongoose";
const ChatSchema = new Schema(
  {
    chatName: {
      type: String,
      trim: true,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    //chat have two user,while groupchat have more then two user
    users: [
      {
        type: _Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: {
      type: _Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: {
      type: _Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
//here chatModel is name of colleaction and chatschema is schema for each collection
export default model("Chat", ChatSchema);
