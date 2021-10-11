import express from "express"
import ChatModel from './chat-schema.js'
import multer from "multer"
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const chatRouter = express.Router()
chatRouter.get("/",  async(req, res, next) => {
    try {
      const chats = await ChatModel.find().populate('members').populate('history')
      res.send(chats)
    } catch (error) {
      next(error)
    }
  })

chatRouter.post("/",  async(req, res, next) => {
    try {
     const chats=await ChatModel.find()

     if(chats.members.length===1){
         //if req.user and the member have a chat and if so return it
        
         if(chats.history.length!==0){

         }
     }
     else {
        const room = {
            members: [req.params.id, req.user._id],
          };
         const newChat =new ChatModel(room)
         await newChat.save()
     }

    } catch (error) {
      next(error)
    }
  })



  chatRouter.get("/:id", async(req, res, next) => {
    try {
      const chat = await ChatModel.findById(req.params._id)
   
      res.send(chat)
     
      next()
    } catch (error) {
      next(error)
    }
  })


/*   cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECTRET,
  }); */
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "chat",
    },
  });
  
  const upload = multer({ storage: storage }).single("img");

  chatRouter.get("/:id/images",upload,  async(req, res, next) => {
    try {
       
        res.status(200).send({ image: req.file.path });
    } catch (error) {
      next(error)
    }
  })

export default chatRouter