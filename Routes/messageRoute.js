const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { sendMessage, allmessages } = require("../controller/messageController");
const router = express.Router();

//sending message api
router.post("/", protect, sendMessage);

//get messgae api
router.get("/:chatID", allmessages);
module.exports = router;
