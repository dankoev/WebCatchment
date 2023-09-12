import express, { json } from "express"
import HBVSimulation from "./HBVSimulation.js"
import process from "node:process"
import { ValueRequireError } from "./ServerExeptions.js"

const PORT = process.env.PORT || 8080

const app = express()
app.use(json())

app.post("/api/getCols", (request, response) => {
  try {
    const result = new HBVSimulation("./HBV-light_data/HBV-land", "test")
      .readResultsInPeriod(request.body)
      .getColumns(request.body)
    response.send(result)
  } catch (err) {
    if (err instanceof ValueRequireError) {
      response.status("400")
      response.send(err.toJSON())
    } else {
      response.status("500")
      response.send()
    }
  }
})
app.listen(PORT)
