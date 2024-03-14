import express from "express"
import { authentication } from "../middleware/auth.mjs"
import { forgotPassword, getProfile, resetPassword, signin, signup, updateProfile } from "../controllers/employee/controller.mjs";
import { signupValidator } from "../controllers/employee/validator.mjs";
import { errorCapture } from "./error.mjs";
import { upload } from "../multer.mjs"

const employeeRouter = express.Router()

employeeRouter.post("/signup", signupValidator, signup)

employeeRouter.post("/login", signin)

employeeRouter.patch("/forgot_password", forgotPassword)

employeeRouter.patch("/reset_password/:token", resetPassword)

employeeRouter.patch("/myprofile", authentication, errorCapture(upload.single("image")), updateProfile)

employeeRouter.get('/myprofile', authentication, getProfile)

export { employeeRouter }