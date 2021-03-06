import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import userRouter from "./services/users/index.js";
import chatRouter from "./services/chatt/index.js";
import passport from "passport";
import googleStrategy from "./auth/googleOauth.js";
import facebookStrategy from "./auth/faOauth.js";
// import cookieParser from "cookie-parser";

const server = express();
const port = process.env.PORT || 3001;

passport.use("google", googleStrategy);
passport.use("facebook", facebookStrategy);

console.log("process---", process.env.MONGOS_CON);

const links = [process.env.FE_DEV_URL, process.env.FE_PRO_URL];
// const links = ["http://localhost:3000", "http://myapp.com"];
const corsOpt = {
  origin: function (origin, next) {
    if (!origin || links.indexOf(origin) !== -1) {
      next(null, true);
      console.log("origin:", origin);
      console.log(port);
    } else {
      next(new Error(`origin  ${origin} NOT found!`));
    }
  },
};

server.use(cors(corsOpt));
server.use(express.json());
// server.use(cookieParser()); //if we decide to use this the token.js has to be refactored
server.use(passport.initialize());

server.use("/users", userRouter);
server.use("/chats", chatRouter);

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
