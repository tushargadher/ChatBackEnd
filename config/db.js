import { connect } from "mongoose";
const mongoURL ="mongodb+srv://tushargadher123:tusharisthebest@cluster0.apylwhc.mongodb.net/?retryWrites=true&w=majority";


const connectToMongo = () => {
  connect(mongoURL).then(() => {
    console.log("Connected to Mongo Successfully...");
  });
};
export default connectToMongo;
// tusharisthebest
