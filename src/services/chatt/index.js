import { Router } from "express";
import chatModel from "./schema.js";
import { jwtAuthMiddleware } from "../../auth/token.js";
import cloudinaryStorage from "../../utils/cloudinary.js";
import multer from "multer";
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
