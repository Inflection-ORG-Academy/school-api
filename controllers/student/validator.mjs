import validator from "validator"
import { CustomError } from "../../routers/error.mjs"
import { errorCapture } from "../../routers/error.mjs"

const registrationValidator = errorCapture(async (req, res, next) => {
  // TODO: validate student data
  next()
})

export { registrationValidator }