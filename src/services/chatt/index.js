import { Router } from "express";
import chatModel from "./schema.js";
import { jwtAuthMiddleware } from "../../auth/token.js";
import cloudinaryStorage from "../../utils/cloudinary.js";
import multer from "multer";
import { sockets } from "../../socket/index.js";
// import createHttpError from "http-errors";

const chatRouter = Router();

chatRouter.get("/sockets", jwtAuthMiddleware, (req, res) => {
  // console.log(req.user._id.toString());
  // console.log(sockets);
  // console.log(sockets[req.user._id.toString()]);
  // console.log(sockets[req.user._id.toString()].rooms);
  res.send();
});

// initiate a chat using POST
chatRouter.post("/", jwtAuthMiddleware, async (req, res, next) => {
  try {
    const { members } = req.body;
    const chatInitiator = req.user._id;
    const allmembers = [...members, chatInitiator];
    const chatRoom = await chatModel.initiateChat(allmembers, chatInitiator);

    // you also want to make sure that all the chat members have their sockets connected to the room
    // otherwise how will they be able to message in real time?
    // usersSocketId
    // for each member
    // memberSocket = sockets[user.id]
    // memberSocket.join(chatRoom.id)

    return res.status(200).json(chatRoom);
  } catch (error) {
    console.log(error);
    next();
  }
});
// GET all my chat
chatRouter.get("/", jwtAuthMiddleware, async (req, res, next) => {
  try {
    const chat = await chatModel
      .find({
        members: req.user._id.toString(),
      })
      .populate({
        path: "members",
        select: "-refreshT -__v -createdAt -updatedAt",
      });

    // console.log(chat);

    // here you are returning to the frontend the chats in which the req.user has been engaging with this far.
    // but we also want the req.user socket to .join these chats, so that s/he will be able to send real time
    // messages to this chat room.

    // go and grab the user socket
    // have this socket .join all the found chats
    sockets[req.user._id.toString()].join(chat.map((c) => c._id.toString()));
    console.log("sockets", sockets);
    res.status(200).send(chat);
  } catch (error) {
    console.log(error);
    next();
  }
});

// GET single chat
chatRouter.get("/:id", jwtAuthMiddleware, async (req, res, next) => {
  try {
    const chat = await chatModel.findById(req.params.id);
    const isMyChat = chat.members.includes(req.user._id);
    if (chat && isMyChat) {
      res.status(200).send(chat);
    } else {
      res.send(`${req.params.id} doesn't exist and/or doesn't belong to you`);
    }
  } catch (error) {
    console.log(error);
    next();
  }
});

// add profile for chatgroup
chatRouter.post(
  "/:id/image",
  multer({ storage: cloudinaryStorage }).single("image"),
  jwtAuthMiddleware,
  async (req, res, next) => {
    try {
      const picURL = req.file.path;
      const chatGroup = await chatModel.findById(req.params.id);
      const isMyChat = chatGroup.members.includes(req.user._id);
      if (chatGroup && isMyChat) {
        const updateAvatar = await chatModel.findByIdAndUpdate(
          req.params.id,
          { avatar: picURL },
          { new: true }
        );
        res.send(updateAvatar);
      } else {
        res.send(`${req.params.id} doesn't exist and/or doesn't belong to you`);
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export default chatRouter;
