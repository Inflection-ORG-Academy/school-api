import "./config.mjs"
import { pgClient } from './database.mjs'
import express from 'express'
const app = express()
import { errorCapture } from './error.mjs'
import { studentRouter } from './student.mjs'
import { admissionRouter } from './admission.mjs'
import { feesRouter } from './fees.mjs'
import { attendanceRouter } from './attendance.mjs'
import morgan from "morgan"

// global middleware
app.use(morgan(":method :url :response-time :status"))

app.use("/students", studentRouter)
app.use("/admissions", admissionRouter)
app.use("/fees", feesRouter)
app.use("/attendances", attendanceRouter)

app.all('*', errorCapture(async (req, res) => {
  throw Error("route not exists")
}))

app.listen(process.env.PORT, async () => {
  await pgClient.connect()
  console.log(`School API listening on port ${process.env.PORT}`)
})