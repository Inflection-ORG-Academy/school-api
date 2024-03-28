import validator from "validator"
import { CustomError } from "../../routers/error.mjs"
import { errorCapture } from "../../routers/error.mjs"

const createAdmissionProformaValidator = errorCapture(async (req, res, next) => {
  const { session, className, standard, startTime, endTime } = req.body
  // TODO: validate here


  req.body.startTime = new Date(startTime)
  req.body.endTime = new Date(endTime)

  next()
})

const createFeesProformaValidator = errorCapture(async (req, res, next) => {
  const { dueDate } = req.body

  req.body.dueDate = new Date(dueDate)

  // TODO: validate here
  next()
})

export { createAdmissionProformaValidator, createFeesProformaValidator }