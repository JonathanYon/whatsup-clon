import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import userModel from "../users/schema.js";

//access token
const newToken = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.ACCESS_TOKEN,
      { expiresIn: "4hr" },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    )
  );

// refresh token
const newRefreshToken = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.REFRESH_TOKEN,
      { expiresIn: "4hr" },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    )
  );
