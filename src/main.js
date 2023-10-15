import express, { json } from "express"
import process from "node:process"
import { ValueRequireError } from "./ServerExeptions.js"
import WeatherData from "./WeatherAPI/WeatherData.js"
import UpdatableSimulation from "./UpdatableSimulation.js"

const PORT = process.env.PORT || 8080

const app = express()
app.use(json())

app.post("/api/getCols", (request, response) => {
  try {
    const { periodStart, periodEnd, columnsNames, location } = request.body
    const result = new UpdatableSimulation(
      WeatherData.updatableLocations[location]
    )
      .readResultsInPeriod(new Date(periodStart), new Date(periodEnd))
      .getColumns(columnsNames)
    response.send(result)
  } catch (err) {
    if (err instanceof ValueRequireError) {
      response.status("400")
      response.send(err.toJSON())
    } else {
      console.error(err)
      response.status("500")
      response.send(err.message)
    }
  }
})
app.get("/api/locationsInfo", (req, res) => {
  const data = WeatherData.locationsArray.map(el => {
    const { key, name, lastInputArchDate, beginInputArchDate } = el
    return {
      key,
      name,
      lastDate: lastInputArchDate,
      beginDate: beginInputArchDate
    }
  })
  res.send(JSON.stringify(data))
})
app.listen(PORT)
