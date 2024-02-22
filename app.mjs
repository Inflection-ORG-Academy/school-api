import express from 'express'
const app = express()
import { errorCapture } from './routers/error.mjs'
import { employeeRouter } from './routers/employee.mjs'
import { studentRouter } from './routers/student.mjs'
import { admissionRouter } from './routers/admission.mjs'
import { feesRouter } from './routers/fee.mjs'
import { attendanceRouter } from './routers/attendance.mjs'
import morgan from "morgan"
import bodyParser from "body-parser"

// global middleware
app.use(morgan(":method :url :response-time :status"))

app.use(bodyParser.json())

app.use("/employees", employeeRouter)
app.use("/students", studentRouter)
app.use("/admissions", admissionRouter)
app.use("/fees", feesRouter)
app.use("/attendances", attendanceRouter)

app.all('*', errorCapture(async (req, res) => {
  throw Error("route not exists")
}))

export { app }