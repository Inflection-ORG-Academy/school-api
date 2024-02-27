import jwt from "jsonwebtoken";
import { CustomError, errorCapture } from "../routers/error.mjs"
import { ACC, ADMIN, CLERK, PRINCI, TEACHER } from "../const.mjs";

const authentication = errorCapture(async (req, res, next) => {
  try {
    const token = req.header("authorization")?.split(" ")[1]
    const data = jwt.verify(token, process.env.JWT_SECRET)
    req.employee = data
    return next();
  } catch (err) {
    throw new CustomError(err, 401, "login failed! login again")
  }
})

const clerkAuthorization = errorCapture(async (req, res, next) => {
  console.log("req.employee")
  if (req.employee.role !== CLERK) {
    if (req.employee.role === PRINCI || req.employee.role === ADMIN) {
      return next()
    } else {
      throw new CustomError(null, 401, "you are not authorized")
    }
  }
  return next()
})
const adminAuthorization = errorCapture(async (req, res, next) => {
  if (req.employee.role !== ADMIN) {
    throw new CustomError(null, 401, "you are not authorized")
  }
  return next()
})
const princiAuthorization = errorCapture(async (req, res, next) => {
  if (req.employee.role !== PRINCI) {
    if (req.employee.role === ADMIN) {
      return next()
    } else {
      throw new CustomError(null, 401, "you are not authorized")
    }
  }
  return next()
})
const teacherAuthorization = errorCapture(async (req, res, next) => {
  if (req.employee.role !== TEACHER) {
    if (req.employee.role === PRINCI || req.employee.role === ADMIN) {
      return next()
    } else {
      throw new CustomError(null, 401, "you are not authorized")
    }
  }
  return next()
})
const accountentAuthorization = errorCapture(async (req, res, next) => {
  if (req.employee.role !== ACC) {
    if (req.employee.role === PRINCI || req.employee.role === ADMIN) {
      return next()
    } else {
      throw new CustomError(null, 401, "you are not authorized")
    }
  }
  return next()
})

export { authentication, clerkAuthorization, adminAuthorization, princiAuthorization, teacherAuthorization, accountentAuthorization }