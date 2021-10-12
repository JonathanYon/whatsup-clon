import { body } from "express-validator"

export const chatValidation = [
    body("sender").exists().withMessage("Sender is a mandatory field!"),
    body("text").exists().withMessage("Text is  a mandatory field!"),
   
]
