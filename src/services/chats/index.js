import express from "express"
import ChatModel from './chat-schema.js'
import MessageModel from './message-schema.js'

const chatRouter = express.Router()


chatRouter.post("/",  async(req, res, next) => {
    try {
     
    } catch (error) {
      next(error)
    }
  })

chatRouter.get("/",  async(req, res, next) => {
    try {
      const chats = await ChatModel.find().populate('members').populate('history')
      res.send(chats)
    } catch (error) {
      next(error)
    }
  })

  chatRouter.get("/:_id", async(req, res, next) => {
    try {
      const chat = await ChatModel.findById(req.params._id)
      res.send(chat)
    } catch (error) {
      next(error)
    }
  })
  chatRouter.get("//images:_id",  async(req, res, next) => {
    try {
      
    } catch (error) {
      next(error)
    }
  })

export default chatRouter