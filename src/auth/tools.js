import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import userModel from "../services/users/schema.js";

//access token
const newToken = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.ACCESS_TOKEN,
      { expiresIn: "1s" },
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
// verify access token
export const verifyToken = (token) =>
  new Promise((resolve, reject) =>
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decodedToken) => {
      if (err) reject(err);
      resolve(decodedToken);
    })
  );
// token authentication
export const jwtAuthentication = async (user) => {
  const accessToken = await newToken({ _id: user._id });
  const refreshToken = await newRefreshToken({ _id: user._id });
  user.refreshT = refreshToken;
  await user.save();
  return { accessToken, refreshToken };
};
//verify refresh token
export const refreshTokenAuth = async (refresh) => {
  try {
    const decodedRefresh = await verifyToken(refresh);
    const user = await userModel.findById(decodedRefresh._id);
    if (!user) throw new Error("User Not Found! R.T");
    if (user.refreshToken === refresh) {
      const { accessToken, refreshToken } =await jwtAuthentication(user);
      return { accessToken, refreshToken };
    }
  } catch (error) {
    console.log(error);
  }
};

/* export const refreshTokens = async actualRefreshToken => {

  const decodedRefreshToken = await verifyRefreshJWT(actualRefreshToken)
  const user = await UserModel.findById(decodedRefreshToken._id)

  if (!user) throw new Error("User not found!")

  if (user.refreshToken === actualRefreshToken) {
    const { accessToken, refreshToken } = await generatePairOfTokens(user)
    return { accessToken, refreshToken }
  } else {
    throw createHttpError(401, "Refresh Token not valid!")
  }
}
 */