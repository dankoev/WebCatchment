import { it, describe } from "mocha"
import assert from "node:assert/strict"
import WeatherData from "../src/WeatherAPI/WeatherData.js"
import UpdatableSimulation from "../src/UpdatableSimulation.js"

function checkDateinPeriod(start, end, location) {
  const correctNames = ["Date", "Precipitation", "Qsim"]
  const wrongNames = ["not"]
  const result = new UpdatableSimulation(location)
    .readResultsInPeriod(new Date(start), new Date(end))
    .getColumns(correctNames.concat(wrongNames))
  const { columns, warningList, ...oterData } = result
  assert.deepStrictEqual(oterData, {
    periodStart: start,
    periodEnd: end
  })
  assert(
    columns.length === correctNames.length,
    "'columns 'length doesn't match"
  )
  const namesWithLength = columns.map(el => {
    const { name, values } = el
    return {
      [name]: values.length
    }
  })
  const daysInPeriodIncludeBounds =
    (new Date(end) - new Date(start)) / 1000 / 60 / 60 / 24 + 1
  assert.deepStrictEqual(
    namesWithLength,
    correctNames.map(el => {
      return {
        [el]: daysInPeriodIncludeBounds
      }
    })
  )
  assert(warningList.length === wrongNames.length, "Wrong warning list")
}
describe("#UpdatableSimulation functions", () => {
  it("read file Results.txt for location", () => {
    checkDateinPeriod(
      "2008-10-10",
      "2009-12-12",
      new WeatherData().locations["Barguzin"]
    )
    checkDateinPeriod(
      "2008-10-10",
      "2010-12-12",
      new WeatherData().locations["Barguzin"]
    )
    checkDateinPeriod(
      "2008-10-31",
      "2009-12-31",
      new WeatherData().locations["Barguzin"]
    )
  })
  it("read file Results.txt with wrong dates", () => {
    assert.throws(() => {
      checkDateinPeriod(
        "2008-10-10",
        "1000-12-12",
        new WeatherData().locations["Barguzin"]
      )
    }, /Incorrect value of period end/)
    assert.throws(() => {
      checkDateinPeriod(
        "1000-10-10",
        "1000-12-12",
        new WeatherData().locations["Barguzin"]
      )
    }, /Incorrect value of period start/)
    assert.throws(() => {
      checkDateinPeriod(
        "1010-13-10",
        "1000-12-12",
        new WeatherData().locations["Barguzin"]
      )
    }, /Incorrect date in period start or end/)
  })
})
