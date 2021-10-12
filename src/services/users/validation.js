import { body } from "express-validator"

export const usersValidationMiddleware = [
    body("username").exists().withMessage("Username is a mandatory field!"),
    body("email").exists("Email is a mandatory field!").isEmail().withMessage("Please send a valid email!"),
]
