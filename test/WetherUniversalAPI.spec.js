import { it, describe } from "mocha"
import assert from "node:assert/strict"
import WeatherUniversalAPI from "../src/WeatherAPI/WeatherUniversalAPI.js"
import WeatherData from "../src/WeatherAPI/WeatherData.js"

describe("WeatherUniversalAPI functions", () => {
  it("get params In day", async () => {
    const data = await new WeatherUniversalAPI(
      new WeatherData("pogoda1").locations.Barguzin
    ).getInputParamsInPeriod("2023-09-07", "2023-09-08")
    
    assert.deepStrictEqual(
      { temp: data[0].temperature, precip: data[0].precipitation },
      {
        temp: [8, 8, 14, 13].reduce((acc, el) => acc + el) / 4,
        precip: [0, 0, 0, 0].reduce((acc, el) => acc + el)
      }
    )
  })
  it("speed test", async () => {
     await new WeatherUniversalAPI(
      new WeatherData("pogoda1").locations.Barguzin
    ).getInputParamsInPeriod("2023-09-01", "2023-09-30")
  })
})
