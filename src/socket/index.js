import { Server } from "socket.io";
import { createServer } from "http";
import listEndpoints from "express-list-endpoints";
import chatModel from "../services/chatt/schema.js";
import { verifyToken } from "../auth/tools.js";

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

    io.use((socket, next) => {
      if (!socket.request.headers.authorization) {
        console.log("unauthorized user establishing a connection...");
        socket.emit("JWT_ERROR");
      } else next();
    });

    io.on("connection", async (socket) => {
      // console.log(socket.request.headers.authorization);
      const { _id: userId } = await verifyToken(
        socket.request.headers.authorization
      );

      console.log("a user is connected with id: " + userId);
      sockets[userId] = socket;

      //getting userId and socketId
      socket.on("addUser", (userId) => {
        addUser(userId, socket.id);
        io.emit("getUser", users);
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
