import express from "express"
import { adminAuthorization, authentication } from "../middleware/employeeAuth.mjs"
import { createAdmissionProformaValidator, createFeesProformaValidator, createSectionProformaValidator } from "../controllers/proforma/validator.mjs";
import {
  activeListAdmissionProforma, createAdmissionProforma,
  createFeesProforma, createSectionProforma, listAdmissionProforma
} from "../controllers/proforma/controller.mjs";

const proformaRouter = express.Router()

proformaRouter.post("/admissions", authentication, adminAuthorization, createAdmissionProformaValidator, createAdmissionProforma)
proformaRouter.post("/fees", authentication, adminAuthorization, createFeesProformaValidator, createFeesProforma)
proformaRouter.post("/sections", authentication, adminAuthorization, createSectionProformaValidator, createSectionProforma)

proformaRouter.get("/admissions", authentication, adminAuthorization, listAdmissionProforma)

// TODO: new todo
proformaRouter.get("/admissions/active", activeListAdmissionProforma)

export { proformaRouter }