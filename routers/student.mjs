import express from "express"
import { errorCapture } from "./error.mjs"
import { authentication, clerkAuthorization } from "../middleware/auth.mjs"
import { registrationValidator } from "../controllers/student/validator.mjs"
import { registerStudent } from "../controllers/student/controller.mjs"


const studentRouter = express.Router()

studentRouter.post('/register', registrationValidator, registerStudent)

export { studentRouter }