const asyncHandler = require("express-async-handler");
const Chat = require("../Models/ChatModel");
const User = require("../Models/userModel");

const accessChat = asyncHandler(async (req, res) => {
  //user will send userId with the request
  const { userId } = req.body;
  if (!userId) {
    res.status(404).send("userId is not found in request");
  }

  //here we are fetching one on one chat of two user
  //groupchat is false and two user ,one user is logged in user and second user which are sending id in request
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } }, //logged in user
      { users: { $elemMatch: { $eq: userId } } }, // user we are sending userId in request
    ],
  })
    //users is only give as is , so if you want other details of user then user populate method
    .populate("users", "-password")
    .populate("latestMessage");

  //here we are adding sender detail in isChat
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  //if chat is not exists then we create a new chat
  if (isChat.length > 0) {
    res.send(isChat[0]);
  }
  //creating new chat
  else {
    var newChat = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(newChat);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(fullChat);
    } catch (error) {
      res.status(400).json(error.message);
    }
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    //fecth only given users chats
    //here req.user._id is come from protect middleware
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 }) //sorting message from new to old
      .then(async (result) => {
        //adding more details of user in result
        result = await User.populate(result, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(result);
      });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  //for creating groupchat we need chatname and users name
  if (!req.body.users || !req.body.name) {
    res.status(400).send({ error: "Please Fill all the feilds" });
  }

  // JSON.parse() to convert text into a JavaScript object
  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .json({ error: "More then 2 users required to create groupchat." });
  }

  //adding logged in user in groupchat
  users.push(req.user);

  try {
    //creating gruopchat
    const groupChat = await Chat.create({
      chatName: req.body.name,
      isGroupChat: true,
      users: users,
      groupAdmin: req.user, //logged in user
    });

    //fecthing groupchat
    const fullGroupchat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupchat);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  if (!req.body.name || !req.body.groupID) {
    res.status(400).send("Please Enter All the Feilds");
  }
  //we need groupid to find which group name is to update
  try {
    const group = await Chat.findByIdAndUpdate(
      req.body.groupID,
      { chatName: req.body.name },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!group) {
      res.status(404).send("Group not found");
    }
    res.json(group);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { userID, groupID } = req.body;
  if (!userID || !groupID) {
    res.status(400).send("Please Enter All the Feilds");
  }
  //we need groupid to find which group name is to update
  try {
    const added = await Chat.findByIdAndUpdate(
      groupID,
      { $push: { users: userID } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!added) {
      res.status(404).send("Group not found");
    }
    res.json(added);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { userID, groupID } = req.body;
  if (!userID || !groupID) {
    res.status(400).send("Please Enter All the Feilds");
  }
  //we need groupid to find which group name is to update
  try {
    const deleted = await Chat.findByIdAndUpdate(
      groupID,
      {
        $pull: { users: userID },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!deleted) {
      res.status(404).send("Group not found");
    }
    res.json(deleted);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
