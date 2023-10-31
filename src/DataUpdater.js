import Logging from "./Logging.js"
import { ServerError, ValueRequireError } from "./ServerExeptions.js"
import UpdatableSimulation from "./UpdatableSimulation.js"
import { parsers } from "./WeatherAPI/Parsers.js"
import WeatherArchiveAPI from "./WeatherAPI/WeatherArchiveApi.js"
import WeatherData from "./WeatherAPI/WeatherData.js"
import WeatherUniversalAPI from "./WeatherAPI/WeatherUniversalAPI.js"

/* Class that implements the composition for
 * update weather data from sites
 * */
export default class DataUpdater {
  static updater = {
    pogoda1: {
      name: "pogoda1",
      getLocations: function() {
        return new WeatherData(this.name).updatableLocations
      },
      parser: parsers.pogoda1,
      updateArchive: this._updateArchiveUniversalApi(parsers.pogoda1),
      updatePrognosis: this._updatePrognosisData(parsers.pogoda1),
      runSim: this._runSim
    },
    pogodaiklimat: {
      name: "pogodaiklimat",
      getLocations: function() {
        return new WeatherData(this.name).updatableLocations
      },
      parser: parsers.pogodaiklimat,
      updateArchive: this._updateArchiveUniversalApi(parsers.pogodaiklimat),
      runSim: this._runSim
    },
    rp5: {
      name: "rp5",
      getLocations: function() {
        return new WeatherData(this.name).updatableLocations
      },
      updateArchive: this._updateArchiveFromRp5,
      runSim: this._runSim
    }
  }

  static enableIntervalUpdater() {
    const _lastInputArchDate = new WeatherData().locationsArray[0][
      "lastInputArchDate"
    ]
    const lastInputArchDate = new Date(_lastInputArchDate)
    lastInputArchDate.setUTCHours(3, 0, 0, 0)
    const hourInMs = 1 * 60 * 60 * 1000

    const checkFunc = async () => {
      const dateUpdate = new Date()
      dateUpdate.setDate(dateUpdate.getDate() - 2)
      console.log(lastInputArchDate, dateUpdate.toISOString())
      if (dateUpdate < lastInputArchDate) return
      console.log("updateData")

      this.updateArchive("pogodaiklimat")
        .then(updater => updater.updatePrognosis("pogoda1"))
        .then(updater => updater.runSim())
    }
    checkFunc()
    setInterval(checkFunc, hourInMs)
  }

  static _updatePrognosisData(parser) {
    return async location => {
      const prognosisApi = new WeatherUniversalAPI(location, parser)
      const prognosisSim = new UpdatableSimulation(location, prognosisApi)
      return prognosisSim
        .updatePrognosisData()
        .then(message => console.log(`${message} for ${location.name}`))
        .catch(err => {
          throw new ServerError(
            `Update prognosis data error for location '${location.name}' <- ${err}`
          )
        })
    }
  }

  static async _runSim(location) {
    console.log("Run similation for " + location.name)
    return await new UpdatableSimulation(location).run().catch(err => {
      throw new ServerError(
        `Simulation Run error for location '${location.name}' <- ${err}`
      )
    })
  }

  static async _updateArchiveFromRp5(location) {
    const archiveApi = new WeatherArchiveAPI(location)
    const archiveSim = new UpdatableSimulation(location, archiveApi)
    await archiveApi
      .updateArchiveData()
      .catch(err => {
        throw new ServerError(
          `Error update .csv file for location '${location.name}' <- ${err}`
        )
      })
      .then(() => archiveSim.updateToLastArchiveData())
      .then(message => console.log(`${message} for ${location.name}`))
      .catch(err => {
        throw new ServerError(
          `Error update ptq.txt file for location '${location.name}' <- ${err}`
        )
      })
  }

  static _updateArchiveUniversalApi(parser) {
    return async location => {
      const archiveApi = new WeatherUniversalAPI(location, parser)
      const archiveSim = new UpdatableSimulation(location, archiveApi)
      await archiveSim
        .updateToLastArchiveData()
        .then(message => console.log(`${message} for ${location.name}`))
        .catch(err => {
          throw new ServerError(
            `Update archive data error for location  '${location.name}' <- ${err}`
          )
        })
    }
  }

  static async updateArchive(siteType) {
    const updater = this.updater[siteType]
    if (!updater) {
      throw new ValueRequireError(`site type ${siteType} not exist`)
    }
    const locations = updater.getLocations()
    await Promise.all(
      Object.values(locations).map(
        async location =>
          await updater
            .updateArchive(location)
            .catch(err => Logging.writeError(err))
      )
    )
    return this
  }

  static async updatePrognosis(siteType) {
    const updater = this.updater[siteType]
    if (!updater?.updatePrognosis) {
      throw new ValueRequireError(
        `updater ${siteType} haven't implementation for updating prognosis data`
      )
    }
    const locations = updater.getLocations()
    await Promise.all(
      Object.values(locations).map(
        async location =>
          await updater
            .updatePrognosis(location)
            .catch(err => Logging.writeError(err))
      )
    )
    return this
  }

  static async runSim(siteType) {
    const updater = this.updater[siteType] ?? this.updater["pogodaiklimat"]
    const locations = updater.getLocations()
    await Promise.all(
      Object.values(locations).map(
        async location =>
          await updater.runSim(location).catch(err => Logging.writeError(err))
      )
    )
  }
}
