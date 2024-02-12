import pkg from "jsonwebtoken";
const { sign } = pkg;
// const key = process.env.JWT_KEY;
const key = "tusharisthebest";
const generateToken = (id) => {
  return sign({ id }, key);
};
export default generateToken;
