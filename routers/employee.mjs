import express from "express"
import { adminAuthorization, authentication } from "../middleware/auth.mjs"
import {
  forgotPassword,
  getMyProfile, listProfiles,
  resetPassword, signin, signup,
  updateProfile, getMyProfilePhoto, getProfilePhoto,
  createAdmissionProforma, createFeesProforma, createSectionProforma,
  listAdmissionProforma, listFeesProforma, listSectionProforma, activeListAdmissionProforma
} from "../controllers/employee/controller.mjs";
import { signupValidator } from "../controllers/employee/validator.mjs";
import { errorCapture } from "./error.mjs";
import { upload } from "../multer.mjs"

const employeeRouter = express.Router()

employeeRouter.post("/signup", authentication, adminAuthorization, signupValidator, signup)

employeeRouter.post("/login", signin)

employeeRouter.patch("/forgot_password", forgotPassword)

employeeRouter.patch("/reset_password/:token", resetPassword)

// TODO: ....
employeeRouter.patch("/profiles/my", authentication, errorCapture(upload.single("image")), updateProfile)

employeeRouter.get("/profiles/my_photo", authentication, getMyProfilePhoto)

employeeRouter.get("/profiles/photo/:id", authentication, adminAuthorization, getProfilePhoto)

employeeRouter.get('/profiles/my', authentication, getMyProfile)

employeeRouter.get("/profiles", authentication, adminAuthorization, listProfiles)

// TODO: new todo
employeeRouter.post("/admission_proforma", authentication, adminAuthorization, createAdmissionProforma)
employeeRouter.post("/fees_proforma", authentication, adminAuthorization, createFeesProforma)
employeeRouter.post("/section_proforma", authentication, adminAuthorization, createSectionProforma)

employeeRouter.get("/admission_proforma", authentication, adminAuthorization, listAdmissionProforma)
employeeRouter.get("/fees_proforma/:admission_proforma_id", listFeesProforma)
employeeRouter.get("/section_proforma/:admission_proforma_id", listSectionProforma)

employeeRouter.get("/admission_proforma/active", activeListAdmissionProforma)

export { employeeRouter }