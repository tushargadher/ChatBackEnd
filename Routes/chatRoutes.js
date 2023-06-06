const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controller/chatControllers");
const router = express.Router();

//show chat only if the user is logged in so , here we add protect middleware
router.post("/", protect, accessChat);
//get all chats of logged in user
router.get("/", protect, fetchChats);
//for creating groupchat
router.post("/group", protect, createGroupChat);
//renaming groupchat
router.put("/rename", protect, renameGroup);
//for adding user in groupchat
router.put("/addToGroup", protect, addToGroup);
//for removing someone from the group chat
router.put("/groupremove", protect, removeFromGroup);

module.exports = router;
