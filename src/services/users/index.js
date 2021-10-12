import { Router } from "express";
import userModel from "./schema.js";
import { jwtAuthMiddleware } from "../../auth/token.js";
import { jwtAuthentication, refreshTokenAuth} from "../../auth/tools.js";
import createHttpError from "http-errors";
import multer from "multer"
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const userRouter = Router();

// register with token
userRouter.post("/account", async (req, res, next) => {
  try {
    const newUser = await userModel(req.body);
    const { _id } = await newUser.save();
    const { accessToken, refreshToken } = await jwtAuthentication(newUser)

    res.status(201).send({ accessToken, refreshToken })
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
//searches user by email or password
userRouter.get("/", jwtAuthMiddleware, async (req, res, next) => {
  try {
    console.log(req.query.name)
const users=await userModel.find()

if(req.query && req.query.name)
{
  const searchByNameResult=users.filter(u=>u.username===req.query.name)
  res.send(searchByNameResult)
}
else if(req.query && req.query.email)
{
  const searchByEmailResult=users.filter(user=>user.email===req.query.email)
  if(searchByEmailResult)
  {
    res.send(searchByEmailResult)
  }
}else{
    res.status(404).send("not found")
  }
  } catch (error) {
    console.log(error);
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
/* userRouter.get("/:id", jwtAuthMiddleware, async (req, res, next) => {
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
}); */

//generate a new refresh token
userRouter.post("/refreshToken", async (req, res, next) => {
  try {
    console.log(req.body)
    const {currentRefreshToken}  = req.body
    console.log(currentRefreshToken)
    const { accessToken, refreshToken } = await refreshTokenAuth(currentRefreshToken)

    res.send({ accessToken, refreshToken })
  } catch (error) {
    next(error)
  }
} 
)

//logouts(session)
userRouter.delete("/logout",jwtAuthMiddleware, async(req,res,next)=>{
  try {
    req.user.refreshT=null
    await req.user.save()
    res.send()
  } catch (error) {
    next(error)
  }
})

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "files",
  },
});

//
userRouter.post("/me/avatar", multer({ storage: storage}).single("avatar"),jwtAuthMiddleware,  async(req, res, next) => {
   console.log(req.file)
  try {
      console.log("id",JSON.stringify(req.params.id))
      const modifiedUser = await userModel.findByIdAndUpdate(
        req.user.id,
        {  avatar: req.file?.path  },
        { new: true }
      )
      if (modifiedUser) {
        res.send(modifiedUser)
      } else {
        next(createError(404, "user Not Found!"))
      }  
  } catch (error) {
      console.log("error",error)
    next(error)
  }
})

export default userRouter;
