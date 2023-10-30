import { it, describe } from "mocha"
import assert from "node:assert/strict"
import { parsers } from "../src/WeatherAPI/Parsers.js"

describe("parsers test", () => {
  it("podoga1 getData #1", async () => {
    const data = await parsers.pogoda1.getParamsByDate(
      "2023-09-07",
      "https://pogoda1.ru/tulun"
    )
    const tempArray = [8, 9, 18, 18]
    const precipArray = [0, 0, 0, 0]
    const tempLen = tempArray.length
    assert.deepStrictEqual(
      { temp: data.temp, precip: data.precip },
      {
        temp: tempArray.reduce((acc, el) => acc + el) / tempLen,
        precip: precipArray.reduce((acc, el) => acc + el)
      }
    )
  })

  it("podoga1 getData #2", async () => {
    const data = await parsers.pogoda1.getParamsByDate(
      "2020-04-18",
      "https://pogoda1.ru/tulun"
    )
    const tempArray = [2, 3, 3, 6]
    const precipArray = [2.7, 3.3, 0.6, 0]
    const tempLen = tempArray.length
    assert.deepStrictEqual(
      { temp: data.temp, precip: data.precip },
      {
        temp: tempArray.reduce((acc, el) => acc + el) / tempLen,
        precip: precipArray.reduce((acc, el) => acc + el)
      }
    )
  })

  it("podoga1 getData #3", async () => {
    const data = await parsers.pogoda1.getParamsByDate(
      "2022-02-04",
      "https://pogoda1.ru/tulun"
    )
    const tempArray = [-22, -24, -24, -24]
    const precipArray = [0, 0, 0, 0]
    const tempLen = tempArray.length
    assert.deepStrictEqual(
      { temp: data.temp, precip: data.precip },
      {
        temp: tempArray.reduce((acc, el) => acc + el) / tempLen,
        precip: precipArray.reduce((acc, el) => acc + el)
      }
    )
  })

  it("podogaiklimat getData #1", async () => {
    const data = await parsers.pogodaiklimat.getParamsByDate(
      "2023-09-07",
      "http://www.pogodaiklimat.ru/weather.php?id=30745"
    )
    const tempArray = [11.8, 11.6, 11.9, 11.1, 10.0, 9.0, 7.9, 6.3]
    const precipArray = [24, 16]
    const tempLen = tempArray.length
    assert.deepStrictEqual(
      { temp: data.temp, precip: data.precip },
      {
        temp: tempArray.reduce((acc, el) => acc + el) / tempLen,
        precip: precipArray.reduce((acc, el) => acc + el)
      }
    )
  })
  it("podogaiklimat getData #2", async () => {
    const data = await parsers.pogodaiklimat.getParamsByDate(
      "2021-01-06",
      "http://www.pogodaiklimat.ru/weather.php?id=30745"
    )
    const tempArray = [-32.6, -30.9, -27.7, -28.3, -29.3, -29.9, -30.2, -31.1]
    const precipArray = [0, 0]
    const tempLen = tempArray.length
    assert.deepStrictEqual(
      { temp: data.temp, precip: data.precip },
      {
        temp: tempArray.reduce((acc, el) => acc + el) / tempLen,
        precip: precipArray.reduce((acc, el) => acc + el)
      }
    )
  })
})
