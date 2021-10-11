import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import chatRouter from "./services/chats/index.js";
import userRouter from "./services/users/index.js";

const server = express();
const port = process.env.PORT || 3001;

console.log("process---", process.env.MONGOS_CON);

server.use(cors());
server.use(express.json());

server.use("users",userRouter)
server.use("/chats",chatRouter)

console.log(listEndpoints(server));

mongoose.connect(process.env.MONGOS_CON);
mongoose.connection.on(`connected`, () => {
  // the string "connected" 👆☝ has to be "connected" nothing more nothing less
  console.log(`🎁 mongo connected Successfully!!`);
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`server running on: ${port}`);
  });
});

mongoose.connection.on(`error`, (err) => {
  console.log(`Mongo Error: ${err}`);
});
