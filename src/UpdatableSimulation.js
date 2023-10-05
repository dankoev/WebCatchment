import HBVSimulation from "./HBVSimulation.js"
import * as fs from "fs"
import path from "path"
import readline from "readline"
import SimulationInput from "./SimulationInput.js"
import WeatherArchiveAPI from "./WeatherAPI/WeatherArchiveApi.js"
import { ServerError } from "./ServerExeptions.js"

export default class UpdatableSimulation extends HBVSimulation {
  _pathToTempFile = path.join(this._catchmentPath, "./Data/temp.txt")

  constructor(location) {
    super(path.resolve(location.pathByPjRoot), "Result")
    this.location = location
    this._pathToInputData = path.join(this._catchmentPath, "./Data/ptq.txt")
  }

  _transformToSimInput(line) {
    const [date, prec, temp, qobs] = line.trim().split("\t")
    const convertedDate = new Date(
      `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`
    )
    return new SimulationInput(+prec, +temp, +qobs, convertedDate)
  }
  _inputsToString(arr) {
    return arr
      .reverse()
      .map(el => el.toString())
      .join("")
  }

  async updateToLastArchiveData() {
    let endComplete
    const resolveFunc = (res, rej) => {
      endComplete = (successMess, err) => {
        if (err) rej(err)
        res(successMess)
      }
    }
    const lastInputArchDate = new Date(this.location.lastInputArchDate)
    const lastArchDate = new Date(this.location.lastArchDate)
    if (+lastArchDate === +lastInputArchDate) {
      return new Promise(res => {
        resolveFunc(res)
        endComplete("Archive date in ptq.txt is up to date")
      })
    }
    const input = fs.createReadStream(this._pathToInputData)
    const readLine = readline.createInterface({ input })
    const output = fs.createWriteStream(this._pathToTempFile)

    const callbackSuccessCreateTempFile = () => {
      fs.rm(this._pathToInputData, rmErr => {
        if (rmErr) endComplete(null, rmErr)
        fs.rename(this._pathToTempFile, this._pathToInputData, renErr => {
          this.location.lastInputArchDate = this.location.lastArchDate
          endComplete("Update ptq.txt to last Archive data complete", renErr)
        })
      })
    }
    const errConfigFun = () => {
      output.removeListener("close", callbackSuccessCreateTempFile)
      output.close()
      endComplete(
        null,
        new ServerError("Config param (lastInputArchDate) error ")
      )
    }
    output.on("close", callbackSuccessCreateTempFile)
    input.on("close", errConfigFun)

    readLine.on("line", async line => {
      if (!/^\d/.test(line)) {
        output.write(line + "\n")
        return
      }

      const simInput = this._transformToSimInput(line)
      if (+simInput.date > +lastInputArchDate) return
      output.write(line + "\n")

      if (+simInput.date === +lastInputArchDate) {
        input.removeListener("close", errConfigFun)
        const periodData = await new WeatherArchiveAPI(
          this.location
        ).getInputParamsInPeriod(lastInputArchDate, lastArchDate)

        const stringPeriod = this._inputsToString(periodData)
        output.write(stringPeriod)
        output.close()
      }
    })
    return new Promise(resolveFunc)
  }
}
