import { Router } from "express";
import userModel from "./schema.js";
import { jwtAuthMiddleware } from "../auth/token.js";
import { jwtAuthentication } from "../auth/tools.js";
import createHttpError from "http-errors";

const userRouter = Router();

// register with token
userRouter.post("/account", async (req, res, next) => {
  try {
    const newUser = await userModel(req.body);
    const { _id } = await newUser.save();
    res.status(201).send(_id);
  } catch (error) {
    console.log(error);
    next(error);
  }
});
// login (session)
userRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.checkCredential(email, password);
    if (user) {
      const { accessToken, refreshToken } = await jwtAuthentication(user);
      res.send({ accessToken, refreshToken });
    } else {
      next(createHttpError(401, "Invalid email and/or password"));
    }
  } catch (error) {
    console.log(error);
    next(createHttpError(401, "Check your login details"));
  }
});
// get me
userRouter.get("/me", jwtAuthMiddleware, async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (error) {
    console.log(error);
  }
});
// change me
userRouter.put("/me", jwtAuthMiddleware, async (req, res, next) => {
  try {
    const user = await userModel.findByIdAndUpdate(
      req.user._id,
      { ...req.body },
      { new: true }
    );
    res.send(user);
  } catch (error) {
    console.log(error);
  }
});
// get single user
userRouter.get("/:id", jwtAuthMiddleware, async (req, res, next) => {
  try {
    const user = await userModel.findById({ _id: req.params.id });
    if (user) {
      res.send(user);
    } else {
      res.send("the pserson you looking for is not found");
    }
  } catch (error) {
    console.log(error);
  }
});

export default userRouter;
