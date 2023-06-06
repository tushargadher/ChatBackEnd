const mongoose = require("mongoose");
const mongoURL ="mongodb+srv://tushargadher123:tusharisthebest@cluster0.apylwhc.mongodb.net/?retryWrites=true&w=majority";


const connectToMongo = () => {
  mongoose.connect(mongoURL).then(() => {
    console.log("Connected to Mongo Successfully...");
  });
};
module.exports = connectToMongo;
// tusharisthebest
