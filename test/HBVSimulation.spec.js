import SimulationResults from "../src/SimulationResults.js"
import SimulationInput from "../src/SimulationInput.js"
import HBVSimulation from "../src/HBVSimulation.js"
import fs from "fs"
import { it, describe } from "mocha"
import path from "path"
import assert from "node:assert/strict"
import { ServerError, ValueRequireError } from "../src/ServerExeptions.js"

describe("creating HBVSimulation obj", () => {
  it("create HBVSimulation obj by path", () => {
    const pathToData = "./HBV-light_data/HBV-land"
    const simulation = new HBVSimulation(pathToData, "test")
    assert(simulation)
  })

  const unsafeSymbols = [
    "",
    "|",
    ";",
    "&",
    "+",
    "*",
    "=",
    "||",
    "&&",
    "!",
    "^",
    "'",
    "'",
    "$",
    "rm",
    "echo",
    "export",
    "BEGIN"
  ]

  it("create HBVSimulation obj with wrong(unsave) path", () => {
    unsafeSymbols.forEach(element => {
      assert.throws(
        () => {
          new HBVSimulation(element, "test")
        },
        ServerError,
        `Don't pass with parameter ${element}`
      )
    })
  })

  it("create HBVSimulation obj with wrong(unsave) nameOuputDir", () => {
    unsafeSymbols.forEach(element => {
      assert.throws(
        () => {
          new HBVSimulation("test", element)
        },
        ServerError,
        `Don't pass with parameter ${element}`
      )
    })
  })
})

describe("#HBVSimulation functions", () => {
  it("read file Results.txt in sended path using 'path'", () => {
    const pathToData = path.resolve("./HBV-light_data/HBV-land")
    const result = new HBVSimulation(pathToData, "test").readResults()
    assert(result instanceof SimulationResults)
  })

  it("raises an error when reading an invalid path", () => {
    const pathToData = path.resolve("./HBV-light_data/HBV-land")
    assert.throws(() => {
      new HBVSimulation(pathToData, "wrongName").readResults()
    }, /^ServerError: Error read Results.txt$/)
  })

  it("read results of simulation in time period with throws", () => {
    const pathToData = path.resolve("./HBV-light_data/HBV-land")
    const notFormatVal = "19811201"
    assert.throws(() => {
      new HBVSimulation(pathToData, "test").readResultsInPeriod(
        notFormatVal,
        "1982-12-02"
      )
    }, ValueRequireError)
  })

  it("read results of simulation in time period", () => {
    const dateStart = new Date("1982-12-30")
    const dateEnd = new Date("1982-12-31")
    const pathToData = path.resolve("./HBV-light_data/HBV-land")

    const result = new HBVSimulation(pathToData, "test")
      .readResultsInPeriod(dateStart, dateEnd)
      .getColumns(["Date"])
    assert.deepStrictEqual(result, {
      warningList: [],
      periodStart: "1982-12-30",
      periodEnd: "1982-12-31",
      columns: [
        {
          name: "Date",
          values: [19821230, 19821231]
        }
      ]
    })
  })

  it("adding data with current time to the file that is used in HBV Simulation", async () => {
    const inputData = new SimulationInput("0.9", "0.9", "0.9")
    const pathToData = "./HBV-light_data/HBV-land"
    const initialData = fs.readFileSync(
      path.join(pathToData, "/Data/ptq.txt"),
      { encoding: "utf8" }
    )
    await new HBVSimulation(pathToData, "test").putInputData(inputData)

    fs.readFile(path.join(pathToData, "/Data/ptq.txt"), "utf8", (_, data) => {
      const rq = new RegExp(inputData.toString())
      assert(rq.test(data))

      //reset file to initial state
      fs.writeFileSync(
        path.join(pathToData, "/Data/ptq.txt"),
        initialData,
        "utf8"
      )
    })
  })

  /*Test for run()*/
})
