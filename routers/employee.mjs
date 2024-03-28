import express from "express"
import { adminAuthorization, authentication } from "../middleware/auth.mjs"
import {
  forgotPassword,
  getMyProfile, listProfiles,
  resetPassword, signin, signup,
  updateProfile, getMyProfilePhoto, getProfilePhoto
} from "../controllers/employee/controller.mjs";
import { signupValidator } from "../controllers/employee/validator.mjs";
import { errorCapture } from "./error.mjs";
import { upload } from "../multer.mjs"

const employeeRouter = express.Router()

employeeRouter.post("/signup", authentication, adminAuthorization, signupValidator, signup)

employeeRouter.post("/login", signin)

employeeRouter.patch("/forgot_password", forgotPassword)

employeeRouter.patch("/reset_password/:token", resetPassword)

employeeRouter.patch("/profiles/my", authentication, errorCapture(upload.single("image")), updateProfile)

employeeRouter.get('/profiles/my', authentication, getMyProfile)

employeeRouter.get("/profiles", authentication, adminAuthorization, listProfiles)

employeeRouter.get("/profiles/photo/:id", authentication, adminAuthorization, getProfilePhoto)
employeeRouter.get("/profiles/my_photo", authentication, getMyProfilePhoto)

export { employeeRouter }