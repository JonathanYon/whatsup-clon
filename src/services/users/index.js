import { Router } from "express";
import userModel from "./schema.js";
import { jwtAuthMiddleware } from "../../auth/token.js";
import { jwtAuthentication } from "../../auth/tools.js";
import createHttpError from "http-errors";
import passport from "passport";

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
// login using google
userRouter.get(
  "/googleLogin",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
userRouter.get(
  "/googleRedirect",
  passport.authenticate("google"),
  async (req, res, next) => {
    try {
      res.cookie(`accessToken`, req.user.tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "none",
      }); //either from the cookies or the url
      res.cookie(`refreshToken`, req.user.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "none",
      }); // withCredential: true in the FE
      res.redirect(
        `${process.env.API_URL}:${process.env.PORT}` //?accessToken=${req.user.tokens.accessToken}&refreshToken=${req.user.tokens.refreshToken}
      );
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);
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
