const express = require("express");
const chats = require("./Data/data");
const dotenv = require("dotenv");
const cors = require("cors");
const connectToMongo = require("./config/db");
const userRoutes = require("./Routes/userRoutes");
const chatRoutes = require("./Routes/chatRoutes");
const messageRoute = require("./Routes/messageRoute");
const app = express();
const host = "localhost";
const port = process.env.PORT || 5000;
const FrontEnd = "http://localhost:5173/";

dotenv.config();
connectToMongo();

app.use(cors());
app.use(express.json()); //to accepet json data

//api routes
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoute);

const server = app.listen(port, () => {
  console.log(`server is running on http://${host}:${port}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: { FrontEnd },
  },
});

//on means what happen when event is emit
io.on("connection", (socket) => {
  console.log("connection to socket.io");

  //creating new socket
  socket.on("setup", (userData) => {
    //getting data from frontEnd and creating a room for user
    socket.join(userData._id);
    socket.emit("connected");
  });

  //joing chat socket,it will take room id from the FrontEnd
  socket.on("join chat", (room) => {
    //create a room with room id
    socket.join(room);
    console.log("User Joined Room ", room);
  });

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.uses not defined");

    chat.users.forEach((user) => {
      //if you sending message in room then it will only recieve to other user not you ,that why below condition is there
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  //typing socket
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  //closing socket to save bandwith
  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
