import "./config.mjs"
import "./database.mjs"
import { app } from "./app.mjs"

(async () => {
  try {
    app.listen(process.env.PORT, async () => {
      console.log(`School API listening on port ${process.env.PORT}`)
    })
  } catch (err) {
    console.log(err)
  }
})()