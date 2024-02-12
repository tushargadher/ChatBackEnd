import asyncHandler from "express-async-handler";
import User from "../Models/userModel.js";
import generateToken from "../config/generateToken.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Enter All the feilds!!");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("user already exists");
  }

  //if the key and value are same then no need to write both
  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  //if user is created
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).send("Falid to create the user!");
  }
});

export const authUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPass(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).send("Please Check your Details...");
  }
};

// searching user with api/user?search=tushar
export const alluser = asyncHandler(async (req, res) => {
  //getting value of seach from the query
  const keyword = req.query.search
    ? //seaeching name and email incasesensetive
      {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  //get all users excepet the logged in user
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
  // console.log(users);
});

// export default { registerUser, authUser, alluser };/
// export default { registerUser, authUser, alluser };
