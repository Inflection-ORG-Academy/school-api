import validator from "validator"
import { CustomError } from "../../routers/error.mjs"
import { errorCapture } from "../../routers/error.mjs"

const signupValidator = errorCapture(async (req, res, next) => {
  const { name, email, pass, role } = req.body

  if (!name) {
    throw new CustomError(null, 400, "name is required")
  }
  var regex = /^[a-zA-Z ]{2,30}$/;
  if (!regex.test(name)) {
    throw new CustomError(null, 400, "name is not valid. name must not contain any special character or number")
  }

  if (!email) {
    throw new CustomError(null, 400, "email is required")
  }
  if (!validator.isEmail(email)) {
    throw new CustomError(null, 400, "email is not valid")
  }
  next()
})

export { signupValidator }