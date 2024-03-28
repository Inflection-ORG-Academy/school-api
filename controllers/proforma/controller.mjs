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
  const data = await db.select().from(AdmissionProforma).innerJoin(FeesProforma, eq(AdmissionProforma.id, FeesProforma.admisionProformaId)).innerJoin(SectionProforma, eq(AdmissionProforma.id, SectionProforma.admisionProformaId))

  //TODO :  parase data object

  const ans = [
    {
      id: 1,
      session: "2024-2025",
      className: "8th",
      standard: 8,
      startTime: "2024-03-27T03:01:17.000Z",
      endTime: "2024-04-10T03:01:17.000Z",
      createdAt: "2024-03-28T03:27:16.000Z",
      createdBy: 1,
      fees_proformas: [
        {
          id: 2,
          admisionProformaId: 1,
          category: "admission",
          name: "uniform",
          amount: 2000,
          appliedFor: "both",
          optional: true,
          isRecuring: false,
          dueDate: "2024-04-10T03:01:17.000Z",
          penaltyRate: 1,
          penaltyIncDay: 30,
          createdAt: "2024-03-28T03:27:16.000Z",
          createdBy: 1
        },
        {
          id: 1,
          admisionProformaId: 1,
          category: "admission",
          name: "registration",
          amount: 200,
          appliedFor: "both",
          optional: false,
          isRecuring: false,
          dueDate: "2024-04-10T03:01:17.000Z",
          penaltyRate: 5,
          penaltyIncDay: 10,
          createdAt: "2024-03-28T03:27:16.000Z",
          createdBy: 1
        }
      ],
      section_proformas: [
        {
          id: 3,
          admisionProformaId: 1,
          name: "A",
          seat: 30,
          createdAt: "2024-03-28T03:27:16.000Z",
          createdBy: 1
        }
      ]
    }
  ]
  res.json(ans)
})

const activeListAdmissionProforma = errorCapture(function (req, res, next) {
  // TODO: list all active admission proforma for public
  res.json({})
})

export {
  createAdmissionProforma, createFeesProforma, createSectionProforma,
  listAdmissionProforma, activeListAdmissionProforma
}