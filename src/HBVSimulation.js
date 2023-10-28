import { exec } from "child_process"
import path from "path"
import SimulationResults from "./SimulationResults.js"
import * as fs from "fs"
import PeriodSimResults from "./PeriodSimResults.js"
import { ServerError, ValueRequireError } from "./ServerExeptions.js"

export default class HBVSimulation {
  _type = "SingleRun"

  constructor(catchmentPath, nameOutputDir) {
    if (!catchmentPath || !nameOutputDir) {
      throw new ValueRequireError(
        "Wrong param(s) catchmentPath or(and) nameOutputDir"
      )
    }
    this._checkValidParametrs(catchmentPath, nameOutputDir)
    this._catchmentPath = path.resolve(catchmentPath)
    this._nameOutputDir = nameOutputDir
  }

  _checkValidParametrs(path, name) {
    const unsafedCommand = ["rm", "echo", "export", "BEGIN"]
    const acceptableSymbolsForPath = /^[\w/.\\:-]+$/
    const acceptableSymbolsForName = /^\w+$/

    if (!acceptableSymbolsForPath.test(path)) {
      throw new ValueRequireError(
        `Invalid symbols in pathName ${path}. Use a-z,A-Z,0-9,_,/,.,-,:`
      )
    }
    if (!acceptableSymbolsForName.test(name)) {
      throw new ValueRequireError(
        `Invalid symbols in nameOutputDir ${name}. Use a-z,A-Z,0-9,_`
      )
    }
    unsafedCommand.forEach(el => {
      if (path.includes(el) || name.includes(el)) {
        throw new ValueRequireError("Unsafe words were used")
      }
    })
  }

  async run() {
    exec(
      `HBV-light-CLI Run ${this._catchmentPath} ${this._type} ${this._nameOutputDir}`,
      (error, stdout, stderr) => {
        if (error) {
          throw new ServerError("Simulation run error. " + error.message)
        }
        if (stderr) {
          throw new ServerError("Runtime error of simulation. " + stderr)
        }
        console.log(stdout)
      }
    )
    return this
  }

  readResults() {
    const nameResults = "./Results.txt"
    try {
      const data = fs.readFileSync(
        path.join(this._catchmentPath, `/${this._nameOutputDir}`, nameResults),
        "utf8"
      )
      return new SimulationResults(data)
    } catch (e) {
      throw new ServerError("Error read Results.txt")
    }
  }

  readResultsInPeriod(startDate, endDate) {
    const nameResults = "./Results.txt"
    try {
      const data = fs.readFileSync(
        path.join(this._catchmentPath, `/${this._nameOutputDir}`, nameResults),
        "utf8"
      )
      return new PeriodSimResults(data, startDate, endDate)
    } catch (e) {
      if (e instanceof ServerError) {
        throw e
      }
      throw new Error("Error read Results.txt " + e.message)
    }
  }

  async putInputData(simulationInput) {
    const pathInputTxt = "./Data/ptq.txt"
    let addingLine = simulationInput.toString()

    const inputData = fs.readFileSync(
      path.join(this._catchmentPath, pathInputTxt),
      {
        encoding: "utf8"
      }
    )

    addingLine =
      inputData.split("\n").pop() === "" ? addingLine : "\n" + addingLine

    fs.appendFile(
      path.join(this._catchmentPath, pathInputTxt),
      addingLine,
      function(error) {
        if (error) {
          console.log(error.message)
          throw new ServerError("error adding data to file 'ptq.txt'")
        }
        console.log(`Added value(s) ${addingLine}into ptq.txt`)
      }
    )
    return this
  }
}
