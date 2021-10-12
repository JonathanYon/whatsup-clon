import passport from "passport";
import FacebookStrategy from "passport-facebook";
import userModel from "../services/users/schema.js";
// import { JWTAuthenticate } from "./tools.js";
import jwt from "jsonwebtoken";

const facebookStrategy = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${process.env.API_URL}:${process.env.PORT}/users/auth/facebook/secrets`,
    profileFields: [
      "id",
      "displayName",
      "name",
      "gender",
      "email",
      "picture.type(large)",
    ],
  },
  async (accessToken, refreshToken, profile, cb) => {
    // console.log("profile---", process.env.FACEBOOK_APP_SECRET);
    try {
      const user = await userModel.findOne({ facebookId: profile.id });
      console.log(user);
      if (user) {
        // const tokens = await JWTAuthenticate(user);
        const token = jwt.sign(
          {
            id: user._id,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1 week",
          }
        );

        cb(null, { token });
      } else {
        console.log("hello");
        const newUser = {
          username: profile.name.givenName,
          avatar: profile.photos[0].value,
          email: profile.emails[0].value,
          facebookId: profile.id,
        };
        const createdUser = new userModel(newUser);
        const savedUser = await createdUser.save();

        // const tokens = await JWTAuthenticate(savedUser);
        const token = jwt.sign(
          {
            id: savedUser._id,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1 week",
          }
        );

        cb(null, { user: savedUser, token });
      }
    } catch (error) {
      console.log(error);
      cb(error);
    }
  }
);

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

export default facebookStrategy;
