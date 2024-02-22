import jwt from "jsonwebtoken";
import { errorCapture } from "../routers/error.mjs"

const auth = errorCapture(async (req, res, next) => {
  const token = req.header("authorization").split(" ")[1]

  try {
    // check token
    const data = jwt.verify(token, process.env.JWT_SECRET)
    req.employee = data
    next();
  } catch (err) {
    res.statusCode = 401
    console.log(err.message)
    res.json({ "error": "login failed! login again" })
  }
})

export { auth }