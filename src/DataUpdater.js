import Logging from "./Logging.js"
import { ServerError, ValueRequireError } from "./ServerExeptions.js"
import UpdatableSimulation from "./UpdatableSimulation.js"
import WeatherArchiveAPI from "./WeatherAPI/WeatherArchiveApi.js"
import WeatherData from "./WeatherAPI/WeatherData.js"
import WeatherUniversalAPI from "./WeatherAPI/WeatherUniversalAPI.js"

export default class DataUpdater {
  static types = {
    pogoda1: {
      name: "pogoda1",
      funcUpdater: DataUpdater._updateLocationFromPogoda1
    },
    rp5: {
      name: "rp5",
      funcUpdater: DataUpdater._updateLocationFromRp5
    }
  }
  static enableIntervalUpdater() {
    const locationsLastArchDates = new WeatherData().locationsArray.map(
      location => location.lastInputArchDate
    )
    const checkPeriodInMs = 4000

    const checkFunc = () => {
      console.log("Update weather data")
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)

      console.log(yesterday, yesterday.toISOString().slice(0, 10))
      locationsLastArchDates
        .map(date => date === yesterday.toISOString().slice(0, 10))
        .forEach(isUpdated => console.log("Updated", isUpdated))
    }
    setInterval(checkFunc, checkPeriodInMs)
  }
  static async _updatePrognosisData(location) {
    return await new UpdatableSimulation(
      location,
      new WeatherUniversalAPI(location)
    )
      .updatePrognosisData()
      .then(message => console.log(`${message} for ${location.name}`))
      .catch(err => {
        throw new ServerError(
          `Update prognosis data error for location '${location.name}' <- ${err.message}`
        )
      })
  }
  static async _runSim(location) {
    console.log("Run similation for " + location.name)
    return await new UpdatableSimulation(location).run().catch(err => {
      throw new ServerError(
        `Simulation Run error for location '${location.name}' <- ${err.message}`
      )
    })
  }
  static async _updateLocationFromRp5(location) {
    const archiveApi = new WeatherArchiveAPI(location)
    const archiveSim = new UpdatableSimulation(location, archiveApi)
    archiveApi
      .updateArchiveData()
      .catch(err => {
        throw new ServerError(
          `Error update .csv file for location '${location.name}' <- ${err.message}`
        )
      })
      .then(() => archiveSim.updateToLastArchiveData())
      .then(message => console.log(`${message} for ${location.name}`))
      .catch(err => {
        throw new ServerError(
          `Error update ptq.txt file for location '${location.name}' <- ${err.message}`
        )
      })
      .then(() => DataUpdater._updatePrognosisData(location))
      .then(() => DataUpdater._runSim(location))
      .catch(err => Logging.writeError(err))
      .catch(err => Logging.writeError(err.message))
  }
  static async _updateLocationFromPogoda1(location) {
    new UpdatableSimulation(location, new WeatherUniversalAPI(location))
      .updateToLastArchiveData()
      .then(message => console.log(`${message} for ${location.name}`))
      .catch(err => {
        throw new ServerError(
          `Update archive data error for location  '${location.name}' <- ${err.message}`
        )
      })
      .then(() => DataUpdater._updatePrognosisData(location))
      .then(() => DataUpdater._runSim(location))
      .catch(err => Logging.writeError(err))
  }
  static updateResultsFrom(siteType) {
    const updaterType = DataUpdater.types[siteType]
    if (!updaterType) {
      throw new ValueRequireError(`site type ${siteType} not exist`)
    }
    const locations = new WeatherData(updaterType.name).updatableLocations
    Object.keys(locations).map(locKey =>
      updaterType.funcUpdater(locations[locKey])
    )
  }
}
// DataUpdater.updateResultsFrom("pogoda1")
// DataUpdater.updateResultsFrom("rp5")
