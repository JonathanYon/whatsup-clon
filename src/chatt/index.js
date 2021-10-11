import { Router } from "express";
import chatModel from "../chatt/schema.js";
import userModel from "../users/schema.js";
import { jwtAuthMiddleware } from "../auth/token.js";
// import { jwtAuthentication } from "../auth/tools.js";
// import createHttpError from "http-errors";

const chatRouter = Router();

// initiate a chat using POST
chatRouter.post("/", jwtAuthMiddleware, async (req, res, next) => {
  try {
    const { members } = req.body;
    const chatInitiator = req.user._id;
    const allmembers = [...members, chatInitiator];
    const chatRoom = await chatModel.initiateChat(allmembers, chatInitiator);
    return res.status(200).json(chatRoom);
  } catch (error) {
    console.log(error);
    next();
  }
});
// GET chat of a user
chatRouter.get("/", jwtAuthMiddleware, async (req, res, next) => {
  try {
    const chat = await chatModel.find({
      members: req.user._id.toString(),
    });
    res.status(200).send(chat);
  } catch (error) {
    console.log(error);
    next();
  }
});

export default chatRouter;
