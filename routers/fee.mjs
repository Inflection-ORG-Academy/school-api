import express from "express"
import { errorCapture } from "./error.mjs"
import { pgClient } from "../database.mjs"

const feesRouter = express.Router()

feesRouter.get('/', errorCapture(async (req, res) => {
  const data = await pgClient.query('SELECT * from fees')
  res.json({ fees: data.rows })
}))

export { feesRouter }