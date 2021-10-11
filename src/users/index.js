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

export default userRouter;
