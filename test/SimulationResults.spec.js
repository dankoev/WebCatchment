import HBVSimulation from "../src/HBVSimulation.js"
import { it, describe } from "mocha"
import path from "path"
import assert from "node:assert/strict"

describe("#SimulationResults functions", () => {
  const pathToData = path.resolve("./HBV-light_data/HBV-land")
  const result = new HBVSimulation(pathToData, "test").readResults()
  it("get names of tabel columns with index", () => {
    assert.deepStrictEqual(result.getHeader(), {
      Date: 0,
      Qsim: 1,
      Qobs: 2,
      Precipitation: 3,
      Temperature: 4,
      AET: 5,
      PET: 6,
      Snow: 7,
      Snowcover: 8,
      SM: 9,
      Recharge: 10,
      SUZ: 11,
      SLZ: 12,
      Q0: 13,
      Q1: 14,
      Q2: 15
    })
  })

  it("get column values by index of column ", () => {
    const correctArray = [
      0.281, 0.278, 0.377, 0.785, 0.643, 0.515, 0.955, 0.933, 0.787, 2.244,
      1.96, 2.476, 2.638, 2.325, 2.035, 1.854, 1.612, 1.395, 2.292, 3.368,
      3.041, 2.683, 2.661, 2.342, 2.056, 1.979, 1.73, 3.38
    ]
    const comparableArray = result
      .getColByIndex(1)
      .slice(0, correctArray.length)
    assert(JSON.stringify(correctArray) === JSON.stringify(comparableArray))
  })

  it("get column values by name of column", () => {
    const correctArray = [
      19811001, 19811002, 19811003, 19811004, 19811005, 19811006, 19811007,
      19811008, 19811009, 19811010, 19811011, 19811012, 19811013, 19811014,
      19811015, 19811016, 19811017, 19811018, 19811019, 19811020, 19811021,
      19811022, 19811023, 19811024, 19811025, 19811026, 19811027, 19811028
    ]
    const comparableArray = result
      .getColByName("Date")
      .slice(0, correctArray.length)
    assert(JSON.stringify(correctArray) === JSON.stringify(comparableArray))
  })

  it("request of column with wrong index", async () => {
    assert.throws(() => {
      result.getColByIndex(-1)
    }, /^Error: Not exist column with this index$/)
  })

  it("request of column with wrong index", async () => {
    assert.throws(() => {
      result.getColByName("WrongName")
    }, /^Error: Not exist column with this name$/)
  })
})
