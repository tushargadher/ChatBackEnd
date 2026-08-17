import { connect } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectToMongo = () => {
  connect(process.env.MONGO).then(() => {
    console.log("Connected to Mongo Successfully...");
  }).catch((err) => {
    console.error("Mongo connection error:", err);
  });
};

export default connectToMongo;
// tusharisthebest
