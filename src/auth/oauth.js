import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import userModel from "../services/users/schema.js";
import { jwtAuthentication } from "./tools.js";

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.API_URL}:${process.env.PORT}/users/googleRedirect`,
    // passReqToCallback   : true
  },
  async (accessToken, refreshToken, profile, next) => {
    console.log(profile);
    try {
      const user = await userModel.findOne({ googleId: profile.id });
      if (user) {
        const tokens = await jwtAuthentication(user);
        next(null, { tokens });
      } else {
        const newUser = {
          username: profile.name.givenName,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
          googleId: profile.id,
        };
        const createNewUser = new userModel(newUser);
        const saveUser = await createNewUser.save();
        const tokens = await jwtAuthentication(saveUser);

        next(null, { user: saveUser, tokens });
      }
    } catch (error) {
      console.log(error);
    }
  }
);

passport.serializeUser(function (user, next) {
  next(null, user);
});
export default googleStrategy;
