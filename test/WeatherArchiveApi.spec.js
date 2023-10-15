import { it, describe } from "mocha"
import assert from "node:assert/strict"
import WeatherArchiveAPI from "../src/WeatherAPI/WeatherArchiveApi.js"
import WeatherData from "../src/WeatherAPI/WeatherData.js"
 
describe("#WeatherArchive functions", () => {
  it("test with wrong location", () => {
    assert.throws(() => {
      new WeatherArchiveAPI(WeatherData.updatableLocations.wrong)
    }, /Wrong location/) 
  })
})
