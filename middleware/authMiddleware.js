const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../Models/userModel");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //taking token from the user header we use split
      //because header looks like "Bearer 'token'"
      token = req.headers.authorization.split(" ")[1];

      //cheking if the token is right or not
      const verifyToken = jwt.verify(token, "tusharisthebest");

      //"-password will not return password"
      req.user = await User.findById(verifyToken.id).select("-password");
      next();
    } catch (error) {
      res.status(401).send("Not Authorized,Token Failed");
    }
  }
  if (!token) {
    res.status(401).send("Not Authorized,Token Failed");
  }
});

module.exports = { protect };
