import { Server } from "socket.io";
import { createServer } from "http";
import listEndpoints from "express-list-endpoints";
import chatModel from "../services/chatt/schema.js";

let users = [];
const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId: socketId });
};
//logout
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};
export const sockets = {};

export const connectSocket = (server) => {
  try {
    const httpServer = createServer(server);
    const io = new Server(httpServer, { allowEIO3: true });
    httpServer.listen(process.env.PORT, () => {
      console.table(listEndpoints(server));
      console.log(
        `socket & port apparently runing on port ${process.env.PORT}`
      );
    });

    io.on("connection", (socket) => {
      console.log("a user is connected");

      // listening to did-connect
      // on did-connect, payload is userid
      // sockets[userid] = socket
      socket.on("did-connect", (payload) => {
        console.log(payload);
      });

      //getting userId and socketId
      socket.on("addUser", (userId) => {
        addUser(userId, socket.id);
        io.emit("getUser", users);
      });

      socket.on("newRoom", async (users) => {
        try {
          console.log(users);
          const newChat = await chatModel({ members: users }).save();
          const chatRoom = newChat._id;
          socket.join(chatRoom);
          socket.emit("joinRoom", newChat);
        } catch (error) {
          console.log(error);
        }
      });
      socket.on("outgoing-msg", async ({ userId, chatId, text, media }) => {
        try {
          const theMessage = {
            sender: userId,
            content: {
              text: text,
              media: media,
            },
          };

          // saving the message to the db....
          // await ChatModel.findByIdAndUpdate(chatid, {.......})

          // emitting the message to the chatId
          // socket.to(chatid).emit("incoming-msg"...........)
        } catch (error) {
          console.log(error);
        }
      });

      socket.on("disconnect", () => {
        removeUser(socket.id);
        io.emit("getUser", users);
      });
    });
  } catch (error) {
    console.log(error);
  }
};
