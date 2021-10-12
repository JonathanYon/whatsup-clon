import express from "express"
import ChatModel from './chat-schema.js'
import multer from "multer"
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { jwtAuthMiddleware } from "../../auth/token.js";
import createHttpError from "http-errors";


const chatRouter = express.Router()
chatRouter.get("/",  async(req, res, next) => {
    try {
      const chats = await ChatModel.find().populate('members').populate('history')
      res.send(chats)
    } catch (error) {
      next(error)
    }
  })

chatRouter.post("/", jwtAuthMiddleware, async(req, res, next) => {
    try {
     const chats=await ChatModel.find()
console.log(req.user)

     if(req.body.members.length===1){
         let chatHistory=await ChatModel.findOne({
             members:[req.user._id,...req.body.members]
         })
         if(chatHistory){
             res.send(chatHistory)
         }
   
     else {
        const room = {
            members: [...req.body.members, req.user._id],
          };
         const newChat =new ChatModel(...req.body,room)
         await newChat.save()
         res.send("room created")
         
     }
     
  }
    } catch (error) {
        console.log(error)
      next(error)
    }
  })



  chatRouter.get("/:id",jwtAuthMiddleware, async(req, res, next) => {
    try {
        console.log(req.params.id)
      const chat = await ChatModel.findById(req.params.id)
   if(chat){
       res.send(chat)
   }
      else{
        next(createHttpError(401, "chat not found"));
      }
     
      next()
    } catch (error) {
      next(error)
    }
  })

  chatRouter.delete(
    "/:chatID/members/:membersID",
    async (req, res, next) => {
      try {
        const chat = await ChatModel.findByIdAndUpdate(
          req.params.chatID,
          {
            $pull: { members: req.params.membersID },
          },
          { useFindAndModify: false }
        );
        
        res.status(204).send();
      } catch (error) {
        next(error);
      }
    }
  );
  chatRouter.delete(
    "/:chatID",
    async (req, res, next) => {
      try {
        const chat = await ChatModel.findByIdAndDelete(
          req.params.chatID
        
        );
        
        res.status(204).send();
      } catch (error) {
        next(error);
      }
    }
  );

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
  
 
  chatRouter.put("/:id/image", multer({ storage: storage}).single("img")/* ,jwtAuthMiddleware */,  async(req, res, next) => {
     console.log(req.file)
    try {
        console.log("id",JSON.stringify(req.params.id))
        let chatHistory=await ChatModel.findOne({
            members:[req.params.id]
        })
        if(chatHistory){

            res.status(200).send({ image: req.file.path });
        }
       else{
        next(createHttpError(401, "not allowed"))
       }
      
        
    } catch (error) {
        console.log("error",error)
      next(error)
    }
  })

export default chatRouter