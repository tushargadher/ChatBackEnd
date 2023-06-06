const mongoose = require("mongoose");
const { Schema } = require("mongoose");
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
//here chatModel is name of colleaction and chatschema is schema for each collection
module.exports = mongoose.model("Chat", ChatSchema);
