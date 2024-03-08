import express from "express"
import { errorCapture } from "./error.mjs"
// import { pgClient } from "../database.mjs"

const attendanceRouter = express.Router()

attendanceRouter.get('/', errorCapture(async (req, res) => {
  // const data = await pgClient.query('SELECT * from attendances')
  res.json({ attendances: data.rows })
}))

export { attendanceRouter }