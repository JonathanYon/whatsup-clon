import { Router } from "express";
import chatModel from "../chatt/schema.js";
import userModel from "../users/schema.js";
import { jwtAuthMiddleware } from "../auth/token.js";
// import { jwtAuthentication } from "../auth/tools.js";
// import createHttpError from "http-errors";

const chatRouter = Router();

export default chatRouter;
