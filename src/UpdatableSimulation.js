import HBVSimulation from "./HBVSimulation.js"
import * as fs from "fs"
import path from "path"
import readline from "readline"
import SimulationInput from "./SimulationInput.js"
import { ServerError, ValueRequireError } from "./ServerExeptions.js"

/*
 * Extension of the "HBVSimulation" class that implements
 * receiving/writing archived/prognosis data into files with
 * simulation input data
 * */
export default class UpdatableSimulation extends HBVSimulation {
  _pathToTempFile = path.join(this._catchmentPath, "./Data/temp.txt")
  _simSettingsPath = path.join(this._catchmentPath, "./Data/Simulation.xml")
  _availableSettings = {
    startPeriod:
      /(<StartOfSimulationPeriod>)(.+)(<\/StartOfSimulationPeriod>)/gm,
    endPeriod: /(<EndOfSimulationPeriod>)(.+)(<\/EndOfSimulationPeriod>)/gm
  }

  constructor(location, updater) {
    if (!location) {
      throw new ValueRequireError("location not specified")
    }
    super(path.resolve(location.pathByPjRoot), "Result")
    this.location = location
    this.updater = updater
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
    return arr.map(el => el.toString()).join("")
  }

  _changeSetting(type, newVal) {
    const settings = fs.readFileSync(this._simSettingsPath, {
      encoding: "utf8"
    })
    if (!this._availableSettings[type]) {
      throw new ValueRequireError(`Setting ${type} not exist`)
    }
    const updatedXml = settings.replace(
      this._availableSettings[type],
      `$1${newVal}$3`
    )
    fs.writeFileSync(this._simSettingsPath, updatedXml, {
      encoding: "utf8"
    })
  }

  async _createPtqFileWithUpdate(conditionCurry, callbackSuccess, errorUpdate) {
    const input = fs.createReadStream(this._pathToInputData)
    const readLine = readline.createInterface({ input })
    const output = fs.createWriteStream(this._pathToTempFile)
    const callbackSuccessCreateTempFile = () => {
      fs.rm(this._pathToInputData, rmErr => {
        if (rmErr) {
          errorUpdate(rmErr)
          return
        }
        fs.rename(this._pathToTempFile, this._pathToInputData, renErr => {
          if (renErr) {
            errorUpdate(renErr)
            return
          }
          callbackSuccess("Update ptq.txt complete ")
        })
      })
    }
    const errConfigFun = () => {
      output.removeListener("close", callbackSuccessCreateTempFile)
      output.close()
      errorUpdate(new ServerError("Config param (lastInputArchDate) error "))
    }
    const readError = err => {
      output.removeListener("close", callbackSuccessCreateTempFile)
      input.removeListener("close", errConfigFun)
      output.close()
      input.close()
      readLine.close()
      errorUpdate(err)
    }
    const ptqUpdater = async line => {
      if (!/^\d/.test(line)) {
        output.write(line + "\n")
        return
      }
      const simInput = this._transformToSimInput(line)
      output.write(line + "\n")
      const condition = conditionCurry(simInput)
      if (condition) {
        input.removeListener("close", errConfigFun)
        readLine.removeListener("line", ptqUpdater)
        try {
          const periodData = await condition()
          const stringPeriod = this._inputsToString(periodData)
          output.write(stringPeriod)
        } catch (err) {
          output.removeListener("close", callbackSuccessCreateTempFile)
          errorUpdate(err)
        }
        output.close()
      }
    }

    output.on("close", callbackSuccessCreateTempFile)
    input.on("close", errConfigFun)
    readLine.on("line", ptqUpdater)

    readLine.on("error", readError)
    input.on("error", readError)
    output.on("error", readError)
  }

  async updateToLastArchiveData() {
    let endComplete
    const resolveFunc = (res, rej) => {
      endComplete = (successMess, err) => {
        if (err) rej(err)
        res(successMess)
      }
    }
    if (this.updater === undefined) {
      throw new ServerError("Updater not specified")
    }
    if (!this.location.updatable) {
      throw new ServerError("Specified location is not updatable")
    }
    const lastInputArchDate = new Date(this.location.lastInputArchDate)
    const lastArchDate = new Date(this.location.lastArchDate)
    if (+lastArchDate === +lastInputArchDate) {
      return new Promise(res => {
        res("Archive date in ptq.txt is up to date")
      })
    }
    const conditionCurry = simInput => {
      if (+simInput.date === +lastInputArchDate) {
        const start = new Date()
        start.setUTCHours(0, 0, 0, 0)
        start.setDate(lastInputArchDate.getDate() + 1)

        const end = new Date()
        end.setUTCHours(0, 0, 0, 0)
        end.setDate(lastArchDate.getDate() + 1)
        return async () => await this.updater.getInputParamsInPeriod(start, end)
      }
    }
    const callbackSuccess = message => {
      this.location["lastInputArchDate"] = this.location.lastArchDate
      this.location["lastDate"] = this.location.lastArchDate
      this._changeSetting(
        "endPeriod",
        new Date(this.location.lastInputArchDate).toISOString()
      )
      endComplete(message + "by archive data")
    }
    const errCreate = err => {
      endComplete(null, err)
    }
    this._createPtqFileWithUpdate(conditionCurry, callbackSuccess, errCreate)
    return new Promise(resolveFunc)
  }

  async updatePrognosisData() {
    const lastInputArchDate = new Date(this.location.lastInputArchDate)
    const lastArchDate = new Date(this.location.lastArchDate)
    if (+lastArchDate !== +lastInputArchDate) {
      throw new ServerError(
        "Update progosis data error. First update the archived data to relevant"
      )
    }
    if (this.updater === undefined) {
      throw new ServerError("Updater not specified")
    }
    let endComplete
    const resolveFunc = (res, rej) => {
      endComplete = (successMess, err) => {
        if (err) rej(err)
        res(successMess)
      }
    }
    const endWeek = new Date()
    endWeek.setDate(endWeek.getDate() + 8)
    endWeek.setUTCHours(0, 0, 0, 0)

    let realDateEnd
    const conditionCurry = simInput => {
      if (+simInput.date === +lastInputArchDate) {
        const start = new Date()
        start.setUTCHours(0, 0, 0, 0)
        start.setDate(lastInputArchDate.getDate() + 1)
        return async () => {
          const data = await this.updater.getInputParamsInPeriod(start, endWeek)
          realDateEnd = data.at(-1)?.date ?? lastArchDate
          return data
        }
      }
    }
    const callbackSuccess = message => {
      this._changeSetting("endPeriod", realDateEnd.toISOString())
      this.location["lastDate"] = realDateEnd.toISOString().slice(0, 10)
      endComplete(message + "by prognosis data")
    }
    const errCreateTempFile = err => {
      endComplete(null, err)
    }
    this._createPtqFileWithUpdate(
      conditionCurry,
      callbackSuccess,
      errCreateTempFile
    )
    return new Promise(resolveFunc)
  }
}
