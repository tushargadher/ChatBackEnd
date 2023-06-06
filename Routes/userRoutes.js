const express = require("express");
const router = express.Router();

//create two routes for login and singup
//importing controller
const { registerUser } = require("../controller/userControllers");
const { authUser } = require("../controller/userControllers");
const { alluser } = require("../controller/userControllers");
const { protect } = require("../middleware/authMiddleware");

router.post("/login", authUser);
router.post("/signUp", registerUser);
//search user api
//protect is middleware
router.get("/", protect, alluser);

//here authUser and registerUser is controller ,basically its a function

module.exports = router;
