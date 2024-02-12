import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { sendMessage, allmessages } from "../controller/messageController.js";
const router = Router();

//sending message api
router.post("/", protect, sendMessage);

//get messgae api
router.get("/:chatID", allmessages);
export default router;
