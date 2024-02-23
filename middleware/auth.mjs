import jwt from "jsonwebtoken";
import { CustomError, errorCapture } from "../routers/error.mjs"

const auth = errorCapture(async (req, res, next) => {
  try {
    const token = req.header("authorization")?.split(" ")[1]
    const data = jwt.verify(token, process.env.JWT_SECRET)
    req.employee = data
    next();
  } catch (err) {
    throw new CustomError(err, 401, "login failed! login again")
  }
})

export { auth }