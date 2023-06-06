const jwt = require("jsonwebtoken");
// const key = process.env.JWT_KEY;
const key = "tusharisthebest";
const generateToken = (id) => {
  return jwt.sign({ id }, key);
};
module.exports = generateToken;
