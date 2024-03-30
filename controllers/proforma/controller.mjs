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

const listAdmissionProforma = errorCapture(async function (req, res, next) {
  const sample = await db.select().from(AdmissionProforma).innerJoin(FeesProforma, eq(AdmissionProforma.id, FeesProforma.admisionProformaId)).innerJoin(SectionProforma, eq(AdmissionProforma.id, SectionProforma.admisionProformaId))
  const output = []
  for (let i = 0; i < sample.length; i++) {
    let isAdmissionExists = false
    let j = 0
    for (j = 0; j < output.length; j++) {
      if (output[j].id === sample[i].admission_proformas.id) {
        isAdmissionExists = true
      }
    }
    if (!isAdmissionExists) {
      output.push(sample[i].admission_proformas)
      output[output.length - 1].fees_proformas = [sample[i].fees_proformas]
      output[output.length - 1].section_proformas = [sample[i].section_proformas]
    } else {
      let isFeesExists = false
      for (let k = 0; k < output[j - 1].fees_proformas.length; k++) {
        if (output[j - 1].fees_proformas[k].id === sample[i].fees_proformas.id) {
          isFeesExists = true
        }
      }
      if (!isFeesExists) {
        output[j - 1].fees_proformas.push(sample[i].fees_proformas)
      }
      let isSectionExists = false
      for (let l = 0; l < output[j - 1].section_proformas.length; l++) {
        if (output[j - 1].section_proformas[l].id === sample[i].section_proformas.id) {
          isSectionExists = true
        }
      }
      if (!isSectionExists) {
        output[j - 1].section_proformas.push(sample[i].section_proformas)
      }
    }
  }

  res.json(output)
})

const activeListAdmissionProforma = errorCapture(function (req, res, next) {
  // TODO: list all active admission proforma for public
  res.json({})
})

export {
  createAdmissionProforma, createFeesProforma, createSectionProforma,
  listAdmissionProforma, activeListAdmissionProforma
}