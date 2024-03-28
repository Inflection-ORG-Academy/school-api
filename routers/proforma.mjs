import express from "express"
import { adminAuthorization, authentication } from "../middleware/auth.mjs"
import { createAdmissionProformaValidator, createFeesProformaValidator, createSectionProformaValidator } from "../controllers/proforma/validator.mjs";
import {
  activeListAdmissionProforma, createAdmissionProforma,
  createFeesProforma, createSectionProforma, listAdmissionProforma
} from "../controllers/proforma/controller.mjs";

const proformaRouter = express.Router()

proformaRouter.post("/admissions", authentication, adminAuthorization, createAdmissionProformaValidator, createAdmissionProforma)
proformaRouter.post("/fees", authentication, adminAuthorization, createFeesProformaValidator, createFeesProforma)
proformaRouter.post("/sections", authentication, adminAuthorization, createSectionProformaValidator, createSectionProforma)

// TODO: new todo
proformaRouter.get("/admissions", authentication, adminAuthorization, listAdmissionProforma)

proformaRouter.get("/admission_proforma/active", activeListAdmissionProforma)

export { proformaRouter }