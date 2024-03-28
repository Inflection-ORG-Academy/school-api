import { CustomError, errorCapture } from "../../routers/error.mjs";
import { db } from "../../database.mjs"
import { and, eq, gt } from 'drizzle-orm';
import { AdmissionProforma, FeesProforma, SectionProforma } from "../../db/models/proforma.mjs";

const createAdmissionProforma = errorCapture(async function (req, res, next) {
  const { session, className, standard, startTime, endTime } = req.body

  const data = await db.insert(AdmissionProforma).values({ session, className, standard, startTime, endTime, createdBy: req.employee.id }).returning()

  res.json(data)
})

const createFeesProforma = errorCapture(async function (req, res, next) {
  const {
    admisionProformaId,
    category,
    name,
    amount,
    appliedFor,
    optional,
    isRecuring,
    dueDate,
    penaltyRate,
    penaltyIncDay
  } = req.body

  const data = await db.insert(FeesProforma).values({
    admisionProformaId,
    category,
    name,
    amount,
    appliedFor,
    optional,
    isRecuring,
    dueDate,
    penaltyRate,
    penaltyIncDay,
    createdBy: req.employee.id
  }).returning()

  res.json(data)
})

const createSectionProforma = errorCapture(async function (req, res, next) {
  const { name, admisionProformaId, seat } = req.body
  const data = await db.insert(SectionProforma).values({ name, admisionProformaId, seat, createdBy: req.employee.id }).returning()
  res.json(data)
})

const listAdmissionProforma = errorCapture(function (req, res, next) {
  // TODO: list all active + inactive admission proforma
  res.json({})
})

const listFeesProforma = errorCapture(function (req, res, next) {
  // TODO: list fees by admission_proforma_id proforma for public
  res.json({})
})

const listSectionProforma = errorCapture(function (req, res, next) {
  // TODO: list section by admission proforma id proforma for public
  res.json({})
})

const activeListAdmissionProforma = errorCapture(function (req, res, next) {
  // TODO: list all active admission proforma for public
  res.json({})
})


export {
  createAdmissionProforma, createFeesProforma, createSectionProforma,
  listAdmissionProforma, listFeesProforma, listSectionProforma, activeListAdmissionProforma
}