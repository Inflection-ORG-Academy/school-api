import "./config.mjs"
import { app } from "./app.mjs"
import { pgClient } from './database.mjs'
(async () => {
  try {
    await pgClient.connect()
    app.listen(process.env.PORT, async () => {
      console.log(`School API listening on port ${process.env.PORT}`)
    })
  } catch (err) {
    console.log(err)
  }
})()