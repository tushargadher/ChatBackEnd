import asyncHandler from "express-async-handler";
import Message from "../Models/messageModel.js";
import Chat from "../Models/ChatModel.js";
import User from "../Models/userModel.js";

export const sendMessage = asyncHandler(async (req, res) => {
  //three things we need logged user chat id and message
  //   console.log(req.user);
  const { content, chatID } = req.body;
  if (!content || !chatID) {
    return res.status(400).send("Invaild Data Passed into Request");
  }

  var newMessage = {
    //we get logged in user from the protect middle ware
    sender: req.user._id,
    content: content,
    chat: chatID,
  };
  try {
    //   creating new message
    var message = await Message.create(newMessage);
    // now we are populating each feild in message
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    //now we find chat by id and update the chat with latest message
    await Chat.findByIdAndUpdate(req.body.chatID, {
      latestMessage: message,
    });
    res.json(message);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

export const allmessages = asyncHandler(async (req, res) => {
  try {
    const message = await Message.find({ chat: req.params.chatID })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(message);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

