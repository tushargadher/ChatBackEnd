import { Router } from "express";
const router = Router();

//create two routes for login and singup
//importing controller
// import {  } from "../controller/userControllers.js";
import {
  authUser,
  alluser,
  registerUser,
} from "../controller/userControllers.js";
// import { alluser } from "../controller/userControllers.js";
import { protect } from "../middleware/authMiddleware.js";

router.post("/login", authUser);
router.post("/signUp", registerUser);
//search user api
//protect is middleware
router.get("/", protect, alluser);

//here authUser and registerUser is controller ,basically its a function

export default router;
