import express from "express"
import { errorCapture } from "./error.mjs"
import { authentication } from "../middleware/studentAuth.mjs"
import { getMyAdmission } from "../controllers/admission/controller.mjs"
// import { pgClient } from "../database.mjs"

const admissionRouter = express.Router()

admissionRouter.get('/my', authentication, getMyAdmission)

export { admissionRouter }