import express from "express"
import { errorCapture } from "./error.mjs"
import { authentication, clerkAuthorization } from "../middleware/auth.mjs"
import { loginValidator, registrationValidator } from "../controllers/student/validator.mjs"
import { loginStudent, registerStudent } from "../controllers/student/controller.mjs"


const studentRouter = express.Router()

studentRouter.post('/register', registrationValidator, registerStudent)
studentRouter.post('/login', loginValidator, loginStudent)

export { studentRouter }