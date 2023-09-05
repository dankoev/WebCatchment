import { exec } from "child_process"
import path from "path"

export default class HBVSimulation {
  _type = "SingleRun"

  constructor(catchmentPath, nameOutputDir) {
    this._checkValidParametrs(catchmentPath, nameOutputDir)
    this._catchmentPath = path.resolve(catchmentPath)
    this._nameOutputDir = nameOutputDir
  }

  _checkValidParametrs(path, name) {
    const unsafedCommand = ["rm", "echo", "export", "BEGIN"]
    const acceptableSymbolsForPath = /^[\w/.\\:-]+$/
    const acceptableSymbolsForName = /^\w+$/

    if (!acceptableSymbolsForPath.test(path)) {
      throw new Error(
        `Invalid symbols in pathName ${path}. Use a-z,A-Z,0-9,_,/,.,-,:`
      )
    }
    if (!acceptableSymbolsForName.test(name)) {
      throw new Error(
        `Invalid symbols in nameOutputDir ${name}. Use a-z,A-Z,0-9,_`
      )
    }
    unsafedCommand.forEach((el) => {
      if (path.includes(el) || name.includes(el)) {
        throw new Error("Unsafe words were used")
      }
    })
  }

  async run() {
    console.log("Run simulation")
    exec(
      `HBV-light-CLI Run ${this._catchmentPath} ${this._type} ${this._nameOutputDir}`,
      (error, stdout, stderr) => {
        if (error) {
          throw new Error("Simulation run error. " + error.message)
        }
        if (stderr) {
          throw new Error("Runtime error of simulation. " + stderr)
        }
        console.log(stdout)
      }
    )
    return this
  }
}
